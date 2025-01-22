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
    const { serviceType, cards, shipping, quantity, totalAmount } = await req.json();
    
    if (!serviceType || !cards || !shipping || !quantity || !totalAmount) {
      console.error('Missing required fields:', { serviceType, cards, shipping, quantity, totalAmount });
      throw new Error('Missing required fields');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Generate a unique order ID with timestamp and random string
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const orderId = `ORD-${timestamp}-${randomStr}`;

    console.log('Creating payment session...', {
      serviceType,
      quantity,
      totalAmount,
      orderId
    });

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
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: shipping.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'RO'],
      },
      success_url: `${req.headers.get('origin')}/success?order_id=${orderId}`,
      cancel_url: `${req.headers.get('origin')}/submit/${serviceType}`,
      metadata: {
        order_id: orderId,
        service_type: serviceType,
        quantity: quantity.toString(),
      }
    });

    console.log('Payment session created:', session.id);

    if (!session.url) {
      throw new Error("No checkout URL returned from Stripe");
    }

    // Initialize Supabase client with service role key
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

    // Create the order record
    const { error: orderError } = await supabase
      .from('card_submission_orders')
      .insert({
        service_type: serviceType,
        total_amount: totalAmount,
        stripe_session_id: session.id,
        payment_status: 'pending'
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Creating card grading records...');

    // Create card grading records for each card
    for (const card of cards) {
      const { error: gradingError } = await supabase
        .from('card_gradings')
        .insert({
          order_id: orderId,
          card_name: card.cardName,
          card_number: card.cardNumber,
          set_name: card.cardSet,
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
          ean8: `${Math.random().toString().substring(2, 10)}`, // Generate a random EAN8 for now
        });

      if (gradingError) {
        console.error('Error creating card grading:', gradingError);
        throw gradingError;
      }
    }

    console.log('Successfully created order and card grading records');

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        orderId: orderId 
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