import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CardVerification } from "@/components/CardVerification";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleTestEmails = async () => {
    try {
      toast({
        title: "Sending test emails...",
        description: "Please wait while we send the test emails. This will take a few seconds.",
      });

      // Test signup email
      const signupResponse = await supabase.functions.invoke('send-auth-email', {
        body: {
          email: 'aladin_2016@yahoo.com',
          type: 'signup'
        }
      });
      console.log("Signup email response:", signupResponse);
      
      // Wait 2 seconds before sending next email
      await delay(2000);

      // Test password reset email
      const resetResponse = await supabase.functions.invoke('send-auth-email', {
        body: {
          email: 'aladin_2016@yahoo.com',
          type: 'reset'
        }
      });
      console.log("Reset email response:", resetResponse);

      // Wait 2 seconds before sending next email
      await delay(2000);

      // Test order confirmation email with sample data
      const orderResponse = await supabase.functions.invoke('send-auth-email', {
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
      console.log("Order confirmation email response:", orderResponse);

      toast({
        title: "Test emails sent successfully!",
        description: "Please check aladin_2016@yahoo.com for all test emails. Note: They might take a few minutes to arrive and could be in your spam folder.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error sending test emails:', error);
      toast({
        variant: "destructive",
        title: "Error sending test emails",
        description: "Please check the console for more details.",
        duration: 5000,
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