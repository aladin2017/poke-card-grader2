import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Numele trebuie să conțină cel puțin 2 caractere.",
  }),
  email: z.string().email({
    message: "Vă rugăm să introduceți o adresă de email validă.",
  }),
  phone: z.string().min(10, {
    message: "Numărul de telefon trebuie să conțină cel puțin 10 caractere.",
  }),
  address: z.string().min(5, {
    message: "Adresa trebuie să conțină cel puțin 5 caractere.",
  }),
  city: z.string().min(2, {
    message: "Orașul trebuie să conțină cel puțin 2 caractere.",
  }),
  state: z.string().min(2, {
    message: "Județul trebuie să conțină cel puțin 2 caractere.",
  }),
  zipCode: z.string().min(4, {
    message: "Codul poștal trebuie să conțină cel puțin 4 caractere.",
  }),
  country: z.string().min(2, {
    message: "Țara trebuie să conțină cel puțin 2 caractere.",
  }),
  serviceType: z.enum(["standard", "express", "premium"], {
    required_error: "Vă rugăm să selectați un tip de serviciu.",
  }),
  shippingMethod: z.enum(["standard", "express", "international"], {
    required_error: "Vă rugăm să selectați o metodă de livrare.",
  }),
  cards: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Numele cărții este obligatoriu"),
      year: z.string().min(4, "Anul trebuie să conțină 4 cifre"),
      set: z.string().min(1, "Setul este obligatoriu"),
      cardNumber: z.string().optional(),
      variant: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
});

const generateEAN8 = (existingEAN8s: string[]): string => {
  const generateNumber = () => {
    let num = '';
    for(let i = 0; i < 7; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return num;
  };

  const calculateCheckDigit = (digits: string): number => {
    let sum = 0;
    for(let i = 0; i < digits.length; i++) {
      const digit = parseInt(digits[i]);
      sum += digit * (i % 2 === 0 ? 3 : 1);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
  };

  const generateUniqueEAN8 = (): string => {
    const digits = generateNumber();
    const checkDigit = calculateCheckDigit(digits);
    const ean8 = digits + checkDigit;
    
    if (existingEAN8s.includes(ean8)) {
      return generateUniqueEAN8();
    }
    return ean8;
  };

  return generateUniqueEAN8();
};

export function GradingForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [cards, setCards] = useState([{ id: "1" }]);

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
      cards: [{ id: "1", name: "", year: "", set: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "cards",
    control: form.control,
  });

  const addCard = () => {
    const newId = (cards.length + 1).toString();
    setCards([...cards, { id: newId }]);
    append({ id: newId, name: "", year: "", set: "" });
  };

  const removeCard = (index: number) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
    remove(index);
  };

  const validateStep = async () => {
    const values = form.getValues();
    
    if (step === 1) {
      const isValid = await form.trigger([
        "fullName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
        "serviceType",
        "shippingMethod",
      ]);
      return isValid;
    }
    
    if (step === 2) {
      const isValid = await form.trigger("cards");
      return isValid;
    }
    
    return true;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (step < 3) {
      const isStepValid = await validateStep();
      if (isStepValid) {
        setStep(step + 1);
      }
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to submit cards for grading.",
        });
        return;
      }

      const orderId = `order-${Date.now()}`;
      
      // Get existing EAN8 codes to avoid duplicates
      const { data: existingCodes } = await supabase
        .from('card_gradings')
        .select('ean8');
      
      const existingEAN8s = existingCodes?.map(code => code.ean8) || [];

      // Create card grading records
      const cardPromises = data.cards.map(async (card) => {
        const ean8 = generateEAN8(existingEAN8s);
        existingEAN8s.push(ean8); // Add to local array to prevent duplicates

        return supabase
          .from('card_gradings')
          .insert({
            order_id: orderId,
            card_name: card.name,
            year: card.year,
            set_name: card.set,
            card_number: card.cardNumber || null,
            variant: card.variant || null,
            notes: card.notes || null,
            ean8: ean8,
            user_id: user.id,
            customer_name: data.fullName,
            customer_email: data.email,
            customer_phone: data.phone,
            customer_address: data.address,
            customer_city: data.city,
            customer_state: data.state,
            customer_zip: data.zipCode,
            customer_country: data.country,
            service_type: data.serviceType,
            shipping_method: data.shippingMethod,
            status: 'pending'
          });
      });

      const results = await Promise.all(cardPromises);
      
      // Check for any errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Errors saving cards:', errors);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error saving some cards. Please try again.",
        });
        return;
      }

      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });

      form.reset();
      setCards([{ id: "1" }]);
      setStep(1);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error submitting your order. Please try again.",
      });
    }
  };

  const calculateTotal = (data: z.infer<typeof formSchema>) => {
    const servicePrice = {
      standard: 15,
      express: 25,
      premium: 35,
    }[data.serviceType];

    const shippingPrice = {
      standard: 10,
      express: 25,
    }[data.shippingMethod];

    return (servicePrice * data.cards.length) + shippingPrice;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Submit Your Cards</h2>
          <Progress value={((step - 1) / 2) * 100} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className={step === 1 ? "text-primary" : ""}>Details</span>
            <span className={step === 2 ? "text-primary" : ""}>Cards</span>
            <span className={step === 3 ? "text-primary" : ""}>Summary</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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
                    <FormLabel>Phone</FormLabel>
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
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
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
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
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
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
                    <FormLabel>ZIP/Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
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
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard ($15/card)</SelectItem>
                        <SelectItem value="express">Express ($25/card)</SelectItem>
                        <SelectItem value="premium">Premium ($35/card)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard ($10)</SelectItem>
                        <SelectItem value="express">Express ($25)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {fields.map((card, index) => (
              <Card key={card.id}>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">Card #{index + 1}</span>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCard(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`cards.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Name</FormLabel>
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
                            <FormLabel>Year</FormLabel>
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
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="4/102" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`cards.${index}.variant`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Holo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`cards.${index}.notes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Any special notes about the card"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addCard}
            >
              Add Another Card
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service ({fields.length} cards)</span>
                    <span>${fields.length * (form.getValues("serviceType") === "standard" ? 15 : form.getValues("serviceType") === "express" ? 25 : 35)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({form.getValues("shippingMethod")})</span>
                    <span>${form.getValues("shippingMethod") === "standard" ? 10 : 25}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal(form.getValues())}.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-between gap-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          )}
          <Button
            type="submit"
            className={step === 1 ? "w-full" : ""}
          >
            {step === 3 ? `Pay $${calculateTotal(form.getValues())}.00` : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
