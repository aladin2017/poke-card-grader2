import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  fullName: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Email invalid"),
  phone: z.string().min(10, "Numărul de telefon trebuie să aibă cel puțin 10 caractere"),
  address: z.string().min(5, "Adresa trebuie să aibă cel puțin 5 caractere"),
  city: z.string().min(2, "Orașul trebuie să aibă cel puțin 2 caractere"),
  state: z.string().min(2, "Județul trebuie să aibă cel puțin 2 caractere"),
  zipCode: z.string().min(6, "Codul poștal trebuie să aibă cel puțin 6 caractere"),
  country: z.string().min(2, "Țara trebuie să aibă cel puțin 2 caractere"),
  serviceType: z.enum(["standard", "medium", "priority"]),
  shippingMethod: z.enum(["standard", "express"]),
  cards: z.array(
    z.object({
      name: z.string().min(2, "Numele cardului trebuie să aibă cel puțin 2 caractere"),
      year: z.string().min(4, "Anul trebuie să aibă 4 caractere"),
      set: z.string().min(2, "Setul trebuie să aibă cel puțin 2 caractere"),
      cardNumber: z.string().optional(),
      variant: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
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
      cards: [{ name: "", year: "", set: "", cardNumber: "", variant: "", notes: "" }],
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (step < 3) {
        setStep(step + 1);
        setProgress((step / 3) * 100);
        return;
      }

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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="+40 123 456 789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresă</FormLabel>
                    <FormControl>
                      <Input placeholder="Strada, Nr." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oraș</FormLabel>
                    <FormControl>
                      <Input placeholder="București" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Județ</FormLabel>
                    <FormControl>
                      <Input placeholder="Sector/Județ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cod Poștal</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Țară</FormLabel>
                    <FormControl>
                      <Input placeholder="România" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Carduri pentru Gradare</h3>
            {form.getValues().cards.map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
                <FormField
                  control={form.control}
                  name={`cards.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume Card</FormLabel>
                      <FormControl>
                        <Input placeholder="Charizard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`cards.${index}.year`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>An</FormLabel>
                      <FormControl>
                        <Input placeholder="1999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`cards.${index}.set`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Set</FormLabel>
                      <FormControl>
                        <Input placeholder="Base Set" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`cards.${index}.cardNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Număr Card (opțional)</FormLabel>
                      <FormControl>
                        <Input placeholder="4/102" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentCards = form.getValues().cards;
                form.setValue('cards', [...currentCards, { name: '', year: '', set: '', cardNumber: '', variant: '', notes: '' }]);
              }}
            >
              Adaugă alt card
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plată</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Număr Card</FormLabel>
                    <FormControl>
                      <Input placeholder="4242 4242 4242 4242" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Expirare</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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