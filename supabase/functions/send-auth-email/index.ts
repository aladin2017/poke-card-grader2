import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  type: "signup" | "reset" | "order_confirmation";
  orderDetails?: {
    orderId: string;
    items: Array<{
      cardName: string;
      serviceType: string;
      price: number;
    }>;
    totalAmount: number;
    shippingAddress: {
      name: string;
      address: string;
      city: string;
      country: string;
    };
  };
}

const getSignupEmailTemplate = (email: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #f8f9fa; padding: 20px; text-align: center; }
      .content { padding: 20px; }
      .footer { margin-top: 40px; font-size: 0.9em; color: #666; text-align: center; }
      .button { 
        background: #0066cc;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Bine ați venit la ABC Grading!</h1>
      </div>
      <div class="content">
        <p>Dragă utilizator,</p>
        <p>Vă mulțumim pentru înregistrarea pe platforma ABC Grading. Suntem încântați să vă avem alături în comunitatea noastră de colecționari de carduri.</p>
        <p>Cu ABC Grading, veți avea acces la:</p>
        <ul>
          <li>Servicii profesionale de gradare</li>
          <li>Sistem transparent de urmărire a comenzilor</li>
          <li>Expertiză în evaluarea cardurilor</li>
          <li>Suport dedicat pentru colecționari</li>
        </ul>
        <p>Pentru orice întrebări sau asistență, nu ezitați să ne contactați.</p>
      </div>
      <div class="footer">
        <p>Cu stimă,<br>Echipa ABC Grading</p>
        <p>Acest email a fost trimis către ${email}</p>
      </div>
    </div>
  </body>
  </html>
`;

const getPasswordResetTemplate = () => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #f8f9fa; padding: 20px; text-align: center; }
      .content { padding: 20px; }
      .footer { margin-top: 40px; font-size: 0.9em; color: #666; text-align: center; }
      .button { 
        background: #0066cc;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Resetare Parolă</h1>
      </div>
      <div class="content">
        <p>Dragă utilizator,</p>
        <p>Am primit o solicitare de resetare a parolei pentru contul dumneavoastră ABC Grading.</p>
        <p>Pentru a vă reseta parola, accesați link-ul de mai jos:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="[RESET_LINK]" class="button">Resetează Parola</a>
        </p>
        <p>Dacă nu ați solicitat resetarea parolei, vă rugăm să ignorați acest email.</p>
        <p>Link-ul de resetare va expira în 24 de ore.</p>
      </div>
      <div class="footer">
        <p>Cu stimă,<br>Echipa ABC Grading</p>
        <p>Din motive de securitate, nu transmiteți acest email altor persoane.</p>
      </div>
    </div>
  </body>
  </html>
`;

const getOrderConfirmationTemplate = (orderDetails: EmailRequest['orderDetails']) => {
  if (!orderDetails) return '';
  
  const itemsList = orderDetails.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.cardName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.serviceType}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} EUR</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { margin-top: 40px; font-size: 0.9em; color: #666; text-align: center; }
        .order-details { margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; }
        .total { margin-top: 20px; text-align: right; font-weight: bold; }
        .shipping-info { margin-top: 30px; padding: 15px; background: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmare Comandă</h1>
          <p>Comanda #${orderDetails.orderId}</p>
        </div>
        <div class="content">
          <p>Dragă ${orderDetails.shippingAddress.name},</p>
          <p>Vă mulțumim pentru comanda plasată la ABC Grading. Mai jos găsiți detaliile comenzii dumneavoastră:</p>
          
          <div class="order-details">
            <table class="table">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd;">Card</th>
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd;">Serviciu</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #ddd;">Preț</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div class="total">
              Total: ${orderDetails.totalAmount.toFixed(2)} EUR
            </div>
          </div>

          <div class="shipping-info">
            <h3>Adresa de livrare:</h3>
            <p>${orderDetails.shippingAddress.name}<br>
            ${orderDetails.shippingAddress.address}<br>
            ${orderDetails.shippingAddress.city}<br>
            ${orderDetails.shippingAddress.country}</p>
          </div>

          <p>Puteți urmări statusul comenzii dumneavoastră în contul ABC Grading.</p>
          <p>Pentru orice întrebări legate de comandă, nu ezitați să ne contactați.</p>
        </div>
        <div class="footer">
          <p>Cu stimă,<br>Echipa ABC Grading</p>
          <p>Acest email servește ca factură pentru comanda dumneavoastră.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting email send process...");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set!");
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { email, type, orderDetails } = await req.json() as EmailRequest;
    console.log("Received request to send email:", { email, type });

    let subject = "";
    let html = "";

    switch (type) {
      case "signup":
        subject = "Bine ați venit la ABC Grading";
        html = getSignupEmailTemplate(email);
        break;
      case "reset":
        subject = "Resetare parolă ABC Grading";
        html = getPasswordResetTemplate();
        break;
      case "order_confirmation":
        if (!orderDetails) {
          throw new Error("Order details are required for order confirmation emails");
        }
        subject = `Confirmare comandă ABC Grading #${orderDetails.orderId}`;
        html = getOrderConfirmationTemplate(orderDetails);
        break;
      default:
        throw new Error("Invalid email type");
    }

    console.log("Attempting to send email via Resend...");
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ABC Grading <no-reply@abc-grading.com>",
        to: [email],
        subject,
        html,
      }),
    });

    const responseData = await res.text();
    console.log("Resend API Response:", responseData);

    if (!res.ok) {
      throw new Error(`Failed to send email: ${responseData}`);
    }

    console.log("Email sent successfully!");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-auth-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);