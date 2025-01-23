import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CardVerification } from "@/components/CardVerification";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleTestEmails = async () => {
    try {
      // Test signup email
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-auth-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: 'aladin_2016@yahoo.com',
          type: 'signup'
        })
      });

      // Test password reset email
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-auth-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: 'aladin_2016@yahoo.com',
          type: 'reset'
        })
      });

      // Test order confirmation email with sample data
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-auth-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
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
        })
      });

      toast({
        title: "Test emails sent!",
        description: "Please check aladin_2016@yahoo.com for all test emails.",
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