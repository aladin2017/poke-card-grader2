import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateEAN8 = async (supabase: any): Promise<string> => {
  const generateNumber = () => {
    let num = '';
    for(let i = 0; i < 7; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return num;
  };

  const calculateCheckDigit = (digits: string): number => {
    let sum = 0;
    for(let i = 0; i < digits.length; i++) {
      const digit = parseInt(digits[i]);
      sum += digit * (i % 2 === 0 ? 3 : 1);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
  };

  const generateUniqueEAN8 = async (): Promise<string> => {
    const digits = generateNumber();
    const checkDigit = calculateCheckDigit(digits);
    const ean8 = digits + checkDigit;
    
    // Check if EAN8 already exists
    const { data: existingCard } = await supabase
      .from('card_gradings')
      .select('ean8')
      .eq('ean8', ean8)
      .single();
    
    if (existingCard) {
      return generateUniqueEAN8();
    }
    return ean8;
  };

  return generateUniqueEAN8();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceType, cards, shipping, quantity, totalAmount } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Try to get user if they are authenticated
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Generate a unique order ID
    const orderId = `order-${Date.now()}`;

    console.log('Creating payment session...');
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
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/submit/${serviceType}`,
      metadata: {
        order_id: orderId,
        user_id: userId
      }
    });

    // Create order record
    const { error: orderError } = await supabase
      .from('card_submission_orders')
      .insert({
        id: orderId,
        user_id: userId,
        service_type: serviceType,
        total_amount: totalAmount,
        stripe_session_id: session.id
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create card grading records
    for (const card of cards) {
      const ean8 = await generateEAN8(supabase);
      
      const { error: cardError } = await supabase
        .from('card_gradings')
        .insert({
          order_id: orderId,
          card_name: card.cardName,
          card_number: card.cardNumber,
          set_name: card.cardSet,
          language: card.language,
          ean8: ean8,
          user_id: userId,
          customer_name: shipping.firstName + ' ' + shipping.lastName,
          customer_email: shipping.email,
          customer_phone: shipping.phonePrefix + shipping.phoneNumber,
          customer_address: shipping.addressLine1,
          customer_city: shipping.city,
          customer_state: shipping.state,
          customer_zip: shipping.zipCode,
          customer_country: shipping.country,
          service_type: serviceType,
          shipping_method: shipping.country === 'Romania' ? 'standard' : 'international',
          status: 'pending'
        });

      if (cardError) {
        console.error('Error creating card grading:', cardError);
        throw cardError;
      }
    }

    console.log('Payment session created:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating payment session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});