import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  type: "signup" | "reset" | "test";
  token?: string;
}

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

    const { email, type } = await req.json() as EmailRequest;
    console.log("Received request to send email to:", email, "type:", type);
    
    // For test emails, we'll send a simple test message
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .footer { margin-top: 40px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Test Email de la ABC Grading</h1>
          <p>Acesta este un email de test pentru a verifica funcționalitatea sistemului de email.</p>
          <div class="footer">
            <p>Cu stimă,<br>Echipa ABC Grading</p>
          </div>
        </div>
      </body>
      </html>
    `;

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
        subject: "Test Email ABC Grading",
        html: html,
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