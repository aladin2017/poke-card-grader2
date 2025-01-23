import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CardVerification } from "@/components/CardVerification";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleTestEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-auth-email', {
        body: {
          email: "contact@abc-grading.com", // Înlocuiește cu adresa ta de email
          type: "test",
        }
      });

      if (error) throw error;

      toast({
        title: "Email de test trimis!",
        description: "Verifică-ți căsuța de email.",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut trimite email-ul de test.",
      });
    }
  };

  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto p-4">
        <Button 
          onClick={handleTestEmail}
          className="mb-8"
        >
          Trimite Email Test
        </Button>
      </div>
      <Pricing />
      <CardVerification />
      <Process />
      <FAQ />
    </main>
  );
};

export default Index;