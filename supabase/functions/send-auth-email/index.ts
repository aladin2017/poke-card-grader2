import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  type: "signup" | "reset";
  token?: string;
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const getSignupEmailTemplate = (confirmLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      background-color: #7c3aed; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer { margin-top: 40px; font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bine ai venit la ABC Grading!</h1>
    <p>Suntem bucuroși să te avem alături de noi. Pentru a-ți activa contul, te rugăm să confirmi adresa de email:</p>
    <a href="${confirmLink}" class="button">Confirmă Email-ul</a>
    <p>Dacă nu tu ai creat acest cont, poți ignora acest email.</p>
    <div class="footer">
      <p>Cu stimă,<br>Echipa ABC Grading</p>
    </div>
  </div>
</body>
</html>
`;

const getResetPasswordEmailTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      background-color: #7c3aed; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer { margin-top: 40px; font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Resetare Parolă ABC Grading</h1>
    <p>Ai solicitat resetarea parolei tale. Click pe butonul de mai jos pentru a seta o nouă parolă:</p>
    <a href="${resetLink}" class="button">Resetează Parola</a>
    <p>Dacă nu tu ai solicitat resetarea parolei, poți ignora acest email.</p>
    <div class="footer">
      <p>Cu stimă,<br>Echipa ABC Grading</p>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, token } = await req.json() as EmailRequest;
    
    // Generate the appropriate link based on the email type
    const baseUrl = "https://abc-grading.com"; // Change this to your domain
    const link = type === "signup" 
      ? `${baseUrl}/auth/confirm?token=${token}`
      : `${baseUrl}/auth/reset-password?token=${token}`;

    // Get the appropriate email template
    const html = type === "signup" 
      ? getSignupEmailTemplate(link)
      : getResetPasswordEmailTemplate(link);

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ABC Grading <no-reply@abc-grading.com>",
        to: [email],
        subject: type === "signup" ? "Confirmă-ți contul ABC Grading" : "Resetare parolă ABC Grading",
        html: html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

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