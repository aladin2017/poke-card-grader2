import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Clock, Zap, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  serviceType: z.enum(["standard", "medium", "priority"], {
    required_error: "Vă rugăm să selectați un tip de serviciu.",
  }),
  shippingMethod: z.enum(["standard", "express"], {
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
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
});

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
      cardNumber: "",
      expiryDate: "",
      cvc: "",
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

  const calculateTotal = (data: z.infer<typeof formSchema>) => {
    const servicePrice = {
      standard: 15,
      medium: 20,
      priority: 25,
    }[data.serviceType];

    const shippingPrice = {
      standard: 10,
      express: 25,
    }[data.shippingMethod];

    return (servicePrice * data.cards.length) + shippingPrice;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // For step 1, validate required fields before proceeding
    if (step === 1) {
      const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 'serviceType', 'shippingMethod'];
      const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      return;
    }

    // For step 2, validate cards before proceeding
    if (step === 2) {
      const isCardsValid = data.cards.every(card => 
        card.name && card.year && card.set
      );

      if (!isCardsValid) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required card information.",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
      return;
    }

    // For step 3 (final step), submit the form
    if (step === 3) {
      const order = {
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
        totalAmount: calculateTotal(data),
      };

      localStorage.setItem('gradingOrders', JSON.stringify([
        ...JSON.parse(localStorage.getItem('gradingOrders') || '[]'),
        order
      ]));

      toast({
        title: "Comandă plasată cu succes!",
        description: "Vă mulțumim pentru comandă. Veți primi un email de confirmare în curând.",
      });

      form.reset();
      setCards([{ id: "1" }]);
      setStep(1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <Progress value={((step - 1) / 2) * 100} className="h-1 bg-gray-800" />
          <div className="flex justify-between text-sm">
            <span className={step === 1 ? "text-pink-500" : "text-gray-500"}>Details</span>
            <span className={step === 2 ? "text-pink-500" : "text-gray-500"}>Cards</span>
            <span className={step === 3 ? "text-pink-500" : "text-gray-500"}>Payment</span>
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
                      <Input placeholder="John Doe" className="bg-black/5 border-0" {...field} />
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
                      <Input placeholder="john@example.com" className="bg-black/5 border-0" {...field} />
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
                      <Input placeholder="+40 123 456 789" className="bg-black/5 border-0" {...field} />
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
                      <Input placeholder="123 Main St" className="bg-black/5 border-0" {...field} />
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
                      <Input placeholder="New York" className="bg-black/5 border-0" {...field} />
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
                      <Input placeholder="NY" className="bg-black/5 border-0" {...field} />
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
                      <Input placeholder="10001" className="bg-black/5 border-0" {...field} />
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
                      <Input placeholder="United States" className="bg-black/5 border-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Service Type</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    className={`p-4 rounded border ${
                      form.watch("serviceType") === "standard"
                        ? "border-pink-500 bg-pink-500/5"
                        : "border-gray-200 hover:border-pink-500"
                    } transition-colors`}
                    onClick={() => form.setValue("serviceType", "standard")}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">STANDARD</div>
                    <div className="text-pink-500">$15</div>
                  </button>
                  <button
                    type="button"
                    className={`p-4 rounded border ${
                      form.watch("serviceType") === "medium"
                        ? "border-pink-500 bg-pink-500/5"
                        : "border-gray-200 hover:border-pink-500"
                    } transition-colors`}
                    onClick={() => form.setValue("serviceType", "medium")}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">MEDIUM</div>
                    <div className="text-pink-500">$20</div>
                  </button>
                  <button
                    type="button"
                    className={`p-4 rounded border ${
                      form.watch("serviceType") === "priority"
                        ? "border-pink-500 bg-pink-500/5"
                        : "border-gray-200 hover:border-pink-500"
                    } transition-colors`}
                    onClick={() => form.setValue("serviceType", "priority")}
                  >
                    <Zap className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">PRIORITY</div>
                    <div className="text-pink-500">$25</div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Shipping Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`p-4 rounded border ${
                      form.watch("shippingMethod") === "standard"
                        ? "border-pink-500 bg-pink-500/5"
                        : "border-gray-200 hover:border-pink-500"
                    } transition-colors`}
                    onClick={() => form.setValue("shippingMethod", "standard")}
                  >
                    <div className="text-sm font-medium">STANDARD</div>
                    <div className="text-pink-500">$10</div>
                  </button>
                  <button
                    type="button"
                    className={`p-4 rounded border ${
                      form.watch("shippingMethod") === "express"
                        ? "border-pink-500 bg-pink-500/5"
                        : "border-gray-200 hover:border-pink-500"
                    } transition-colors`}
                    onClick={() => form.setValue("shippingMethod", "express")}
                  >
                    <div className="text-sm font-medium">EXPRESS</div>
                    <div className="text-pink-500">$25</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {fields.map((card, index) => (
              <Card key={card.id} className="bg-black/5 border-0">
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-pink-500">Card #{index + 1}</span>
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
                              <Input placeholder="Charizard" className="bg-black/5 border-0" {...field} />
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
                              <Input placeholder="1999" className="bg-black/5 border-0" {...field} />
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
                              <Input placeholder="Base Set" className="bg-black/5 border-0" {...field} />
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
                              <Input placeholder="4/102" className="bg-black/5 border-0" {...field} />
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
                              <Input placeholder="Holo" className="bg-black/5 border-0" {...field} />
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
                                className="bg-black/5 border-0"
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
              className="w-full border-dashed"
              onClick={addCard}
            >
              Add Another Card
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Card className="bg-black/5 border-0">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service ({fields.length} cards)</span>
                    <span>${fields.length * (form.getValues("serviceType") === "standard" ? 15 : form.getValues("serviceType") === "medium" ? 20 : 25)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({form.getValues("shippingMethod")})</span>
                    <span>${form.getValues("shippingMethod") === "standard" ? 10 : 25}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance (1%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal(form.getValues())}.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="4242 4242 4242 4242" 
                          className="bg-black/5 border-0 pl-10" 
                          {...field}
                        />
                        <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MM/YY" 
                          className="bg-black/5 border-0" 
                          {...field}
                        />
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
                        <Input 
                          placeholder="123" 
                          className="bg-black/5 border-0" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="bg-transparent"
            >
              Previous
            </Button>
          )}
          <Button
            type="submit"
            className={`${step === 3 ? 'bg-pink-500 hover:bg-pink-600' : 'bg-pink-500 hover:bg-pink-600'} ${step === 1 ? "w-full" : ""}`}
          >
            {step === 3 ? `Pay $${calculateTotal(form.getValues())}.00` : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
