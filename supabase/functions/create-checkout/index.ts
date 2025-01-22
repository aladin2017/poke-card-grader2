import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Parsing request body...');
    const { serviceType, cards, shipping, quantity, totalAmount } = await req.json();
    
    console.log('Received request data:', {
      serviceType,
      cardsCount: cards?.length,
      shipping: shipping ? 'present' : 'missing',
      quantity,
      totalAmount
    });

    if (!serviceType || !cards || !shipping || !quantity || !totalAmount) {
      throw new Error('Missing required fields');
    }

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('Cards must be a non-empty array');
    }

    if (!shipping.email) {
      throw new Error('Shipping email is required');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const orderDisplayId = `ORD-${timestamp}-${randomStr}`;

    console.log('Creating payment session...', {
      serviceType,
      quantity,
      totalAmount,
      orderDisplayId
    });

    // Create the session with the correct mode
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Card Grading Service - ${serviceType}`,
              description: `Grading service for ${quantity} card(s)`,
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: shipping.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'RO'],
      },
      success_url: `${req.headers.get('origin')}/success?order_id=${orderDisplayId}`,
      cancel_url: `${req.headers.get('origin')}/submit/${serviceType}`,
      metadata: {
        order_display_id: orderDisplayId,
        service_type: serviceType,
        quantity: quantity.toString(),
      }
    });

    if (!session.url) {
      throw new Error("No checkout URL returned from Stripe");
    }

    console.log('Payment session created:', session.id);

    // Get user ID if authenticated
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_ANON_KEY') || '',
      );
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Creating order record...');

    const { data: orderData, error: orderError } = await supabase
      .from('card_submission_orders')
      .insert({
        user_id: userId, // This can be null for anonymous users
        service_type: serviceType,
        total_amount: totalAmount,
        stripe_session_id: session.id,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order record');
    }

    console.log('Creating card grading records...');

    for (const card of cards) {
      const { error: gradingError } = await supabase
        .from('card_gradings')
        .insert({
          order_id: orderDisplayId,
          card_name: card.cardName,
          card_number: card.cardNumber,
          set_name: card.cardSet,
          user_id: userId, // This can be null for anonymous users
          customer_name: `${shipping.firstName} ${shipping.lastName}`,
          customer_email: shipping.email,
          customer_phone: `${shipping.phonePrefix}${shipping.phoneNumber}`,
          customer_address: shipping.addressLine1,
          customer_city: shipping.city,
          customer_state: shipping.state,
          customer_zip: shipping.zipCode,
          customer_country: shipping.country,
          service_type: serviceType,
          shipping_method: shipping.country === 'Romania' ? 'standard' : 'international',
          status: 'pending',
          ean8: `${Math.random().toString().substring(2, 10)}`,
        });

      if (gradingError) {
        console.error('Error creating card grading:', gradingError);
        throw new Error('Failed to create card grading record');
      }
    }

    console.log('Successfully created order and card grading records');

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        orderId: orderDisplayId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});