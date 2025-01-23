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
      .benefits {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .benefit-item {
        display: flex;
        align-items: center;
        margin: 10px 0;
      }
      .social-links {
        margin-top: 20px;
        text-align: center;
      }
      .social-link {
        margin: 0 10px;
        color: #0066cc;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to ABC Grading!</h1>
      </div>
      <div class="content">
        <p>Dear Collector,</p>
        <p>Thank you for joining ABC Grading! We're thrilled to welcome you to our community of passionate card collectors and enthusiasts.</p>
        
        <div class="benefits">
          <h2>Your Premium Benefits</h2>
          <div class="benefit-item">
            ✓ Professional Card Grading Services
          </div>
          <div class="benefit-item">
            ✓ Real-time Order Tracking
          </div>
          <div class="benefit-item">
            ✓ Expert Card Evaluation
          </div>
          <div class="benefit-item">
            ✓ Secure Storage Solutions
          </div>
          <div class="benefit-item">
            ✓ Priority Customer Support
          </div>
        </div>

        <p>Get started by submitting your first card for grading:</p>
        <p style="text-align: center;">
          <a href="https://abc-grading.com/submit" class="button">Submit Cards Now</a>
        </p>

        <p>Need help getting started?</p>
        <ul>
          <li>Visit our <a href="https://abc-grading.com/faq">FAQ page</a></li>
          <li>Contact our support team at support@abc-grading.com</li>
          <li>Follow our social media for tips and updates</li>
        </ul>
      </div>
      
      <div class="social-links">
        <a href="https://facebook.com/abcgrading" class="social-link">Facebook</a>
        <a href="https://instagram.com/abcgrading" class="social-link">Instagram</a>
        <a href="https://twitter.com/abcgrading" class="social-link">Twitter</a>
      </div>

      <div class="footer">
        <p>Best regards,<br>The ABC Grading Team</p>
        <p>This email was sent to ${email}</p>
        <p>© ${new Date().getFullYear()} ABC Grading. All rights reserved.</p>
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
      .security-notice {
        background: #fff3cd;
        border: 1px solid #ffeeba;
        color: #856404;
        padding: 15px;
        border-radius: 4px;
        margin: 20px 0;
      }
      .steps {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .step {
        margin: 10px 0;
        padding-left: 20px;
        position: relative;
      }
      .step:before {
        content: "→";
        position: absolute;
        left: 0;
        color: #0066cc;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>We received a request to reset your password for your ABC Grading account. If you didn't make this request, please ignore this email.</p>

        <div class="security-notice">
          <strong>⚠️ Security Notice:</strong>
          <p>This link will expire in 24 hours for your security.</p>
        </div>

        <div class="steps">
          <h3>To reset your password:</h3>
          <div class="step">Click the button below</div>
          <div class="step">Create a new secure password</div>
          <div class="step">Log in with your new password</div>
        </div>

        <p style="text-align: center; margin: 30px 0;">
          <a href="[RESET_LINK]" class="button">Reset Password</a>
        </p>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">[RESET_LINK]</p>

        <p><strong>Security Tips:</strong></p>
        <ul>
          <li>Never share your password with anyone</li>
          <li>Use a unique password for each account</li>
          <li>Include numbers, symbols, and mixed-case letters</li>
        </ul>
      </div>
      <div class="footer">
        <p>Best regards,<br>ABC Grading Security Team</p>
        <p>If you didn't request this reset, please contact us immediately at security@abc-grading.com</p>
        <p>© ${new Date().getFullYear()} ABC Grading. All rights reserved.</p>
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
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .company-info {
          text-align: right;
        }
        .order-summary {
          background: #f8f9fa;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .tracking-info {
          background: #e3f2fd;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .next-steps {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Invoice #${orderDetails.orderId}</p>
        </div>
        <div class="content">
          <div class="invoice-header">
            <div>
              <h2>INVOICE</h2>
              <p>Date: ${new Date().toLocaleDateString()}</p>
              <p>Order ID: ${orderDetails.orderId}</p>
            </div>
            <div class="company-info">
              <strong>ABC Grading</strong><br>
              123 Grading Street<br>
              Bucharest, Romania<br>
              VAT: RO12345678
            </div>
          </div>

          <div class="order-summary">
            <h3>Order Summary</h3>
            <table class="table">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd;">Card</th>
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd;">Service</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div class="total">
              <p>Subtotal: ${(orderDetails.totalAmount * 0.81).toFixed(2)} EUR</p>
              <p>VAT (19%): ${(orderDetails.totalAmount * 0.19).toFixed(2)} EUR</p>
              <p style="font-size: 1.2em;">Total: ${orderDetails.totalAmount.toFixed(2)} EUR</p>
            </div>
          </div>

          <div class="shipping-info">
            <h3>Shipping Information</h3>
            <p>${orderDetails.shippingAddress.name}<br>
            ${orderDetails.shippingAddress.address}<br>
            ${orderDetails.shippingAddress.city}<br>
            ${orderDetails.shippingAddress.country}</p>
          </div>

          <div class="tracking-info">
            <h3>Track Your Order</h3>
            <p>You can track your order status by logging into your ABC Grading account:</p>
            <p style="text-align: center;">
              <a href="https://abc-grading.com/dashboard" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Order Status</a>
            </p>
          </div>

          <div class="next-steps">
            <h3>Next Steps</h3>
            <ol>
              <li>Package your cards securely</li>
              <li>Include a printout of this invoice</li>
              <li>Ship to our grading facility</li>
              <li>Track progress in your dashboard</li>
            </ol>
          </div>

          <p>Need help? Contact our support team at support@abc-grading.com</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing ABC Grading!</p>
          <p>This email serves as your official invoice.</p>
          <p>© ${new Date().getFullYear()} ABC Grading. All rights reserved.</p>
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
        subject = "Welcome to ABC Grading - Your Account is Ready!";
        html = getSignupEmailTemplate(email);
        break;
      case "reset":
        subject = "ABC Grading - Password Reset Request";
        html = getPasswordResetTemplate();
        break;
      case "order_confirmation":
        if (!orderDetails) {
          throw new Error("Order details are required for order confirmation emails");
        }
        subject = `ABC Grading - Order Confirmation #${orderDetails.orderId}`;
        html = getOrderConfirmationTemplate(orderDetails);
        break;
      default:
        throw new Error("Invalid email type");
    }

    console.log(`Attempting to send ${type} email via Resend...`);
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: {
          name: "ABC Grading",
          email: "noreply@abc-grading.com"
        },
        to: [email],
        subject,
        html,
        reply_to: "support@abc-grading.com"
      }),
    });

    const responseData = await res.text();
    console.log(`Resend API Response for ${type} email:`, responseData);

    if (!res.ok) {
      throw new Error(`Failed to send ${type} email: ${responseData}`);
    }

    console.log(`${type} email sent successfully!`);

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
