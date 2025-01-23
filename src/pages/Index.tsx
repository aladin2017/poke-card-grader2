import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CardVerification } from "@/components/CardVerification";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleTestEmails = async () => {
    try {
      toast({
        title: "Sending test emails...",
        description: "Please wait while we send the test emails.",
      });

      // Test signup email
      await supabase.functions.invoke('send-auth-email', {
        body: {
          email: 'aladin_2016@yahoo.com',
          type: 'signup'
        }
      });
      console.log("Signup email sent");

      // Wait 2 seconds before sending next email
      await delay(2000);

      // Test password reset email
      await supabase.functions.invoke('send-auth-email', {
        body: {
          email: 'aladin_2016@yahoo.com',
          type: 'reset'
        }
      });
      console.log("Reset email sent");

      // Wait 2 seconds before sending next email
      await delay(2000);

      // Test order confirmation email with sample data
      await supabase.functions.invoke('send-auth-email', {
        body: {
          email: 'aladin_2016@yahoo.com',
          type: 'order_confirmation',
          orderDetails: {
            orderId: 'TEST-123',
            items: [
              {
                cardName: 'Charizard',
                serviceType: 'premium',
                price: 35.00
              },
              {
                cardName: 'Pikachu',
                serviceType: 'standard',
                price: 12.00
              }
            ],
            totalAmount: 47.00,
            shippingAddress: {
              name: 'Test Customer',
              address: '123 Test Street',
              city: 'Test City',
              country: 'Romania'
            }
          }
        }
      });
      console.log("Order confirmation email sent");

      toast({
        title: "Test emails sent!",
        description: "Please check aladin_2016@yahoo.com for all test emails. Note: They might be in your spam folder.",
      });
    } catch (error) {
      console.error('Error sending test emails:', error);
      toast({
        variant: "destructive",
        title: "Error sending test emails",
        description: "Please check the console for more details.",
      });
    }
  };

  return (
    <main className="min-h-screen">
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={handleTestEmails}
          variant="default"
          size="lg"
          className="shadow-lg"
        >
          Send Test Emails
        </Button>
      </div>
      <Hero />
      <Pricing />
      <CardVerification />
      <Process />
      <FAQ />
    </main>
  );
};

export default Index;