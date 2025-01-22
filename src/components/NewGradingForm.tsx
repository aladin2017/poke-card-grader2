import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Email invalid"),
  phone: z.string().min(10, "Numărul de telefon trebuie să aibă cel puțin 10 caractere"),
  address: z.string().min(5, "Adresa trebuie să aibă cel puțin 5 caractere"),
  city: z.string().min(2, "Orașul trebuie să aibă cel puțin 2 caractere"),
  state: z.string().min(2, "Județul trebuie să aibă cel puțin 2 caractere"),
  zipCode: z.string().min(6, "Codul poștal trebuie să aibă cel puțin 6 caractere"),
  country: z.string().min(2, "Țara trebuie să aibă cel puțin 2 caractere"),
  
  // Service Info
  serviceType: z.enum(["standard", "medium", "priority"]),
  shippingMethod: z.enum(["standard", "express"]),
  
  // Cards
  cards: z.array(z.object({
    name: z.string().min(2, "Numele cardului trebuie să aibă cel puțin 2 caractere"),
    year: z.string().min(4, "Anul trebuie să aibă 4 caractere"),
    set: z.string().min(2, "Setul trebuie să aibă cel puțin 2 caractere")
  })),
  
  // Payment
  cardNumber: z.string().min(16, "Numărul cardului trebuie să aibă 16 caractere"),
  expiryDate: z.string().min(5, "Data expirării trebuie să fie în formatul MM/YY"),
  cvc: z.string().min(3, "CVC-ul trebuie să aibă 3 caractere")
});

export function NewGradingForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      serviceType: "standard",
      shippingMethod: "standard",
      cards: [{ name: "", year: "", set: "" }],
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (step < 3) {
        const isValid = await form.trigger();
        if (isValid) {
          setStep(step + 1);
          setProgress((step / 3) * 100);
        }
        return;
      }

      // Final submission
      console.log("Form submitted:", values);
      toast({
        title: "Succes!",
        description: "Formularul a fost trimis cu succes.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la trimiterea formularului.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informații Personale</h3>
            {/* Personal Info Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Nume Complet</Form.Label>
                    <Form.Control>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              {/* Add other personal info fields similarly */}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Carduri pentru Gradare</h3>
            {/* Cards Fields */}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plată</h3>
            {/* Payment Fields */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between text-sm">
          <span className={step === 1 ? "text-primary" : ""}>Informații Personale</span>
          <span className={step === 2 ? "text-primary" : ""}>Carduri</span>
          <span className={step === 3 ? "text-primary" : ""}>Plată</span>
        </div>

        {renderStep()}

        <div className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep(step - 1);
                setProgress(((step - 2) / 3) * 100);
              }}
            >
              Înapoi
            </Button>
          )}
          <Button type="submit">
            {step === 3 ? "Finalizează" : "Continuă"}
          </Button>
        </div>
      </form>
    </Form>
  );
}