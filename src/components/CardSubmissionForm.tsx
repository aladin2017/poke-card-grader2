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
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";

const cardSchema = z.object({
  cardName: z.string().min(1, "Card name is required"),
  cardNumber: z.string().min(1, "Card number is required"),
  cardSet: z.string().min(1, "Card set is required"),
});

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/County is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

const formSchema = z.object({
  cards: z.array(cardSchema),
  shipping: shippingSchema,
});

const getPricePerCard = (serviceType: string) => {
  const prices = {
    bulk: 12,
    standard: 15,
    medium: 20,
    priority: 25,
    express: 30,
  };
  return prices[serviceType.toLowerCase()] || 15;
};

export function CardSubmissionForm() {
  const { toast } = useToast();
  const { serviceType } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pricePerCard = getPricePerCard(serviceType || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cards: [{ cardName: "", cardNumber: "", cardSet: "" }],
      shipping: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const addCard = () => {
    append({ cardName: "", cardNumber: "", cardSet: "" });
  };

  const removeCard = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotal = () => {
    return fields.length * pricePerCard;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to submit cards");
      }

      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          serviceType,
          cards: data.cards,
          shipping: data.shipping,
          quantity: data.cards.length,
          totalAmount: calculateTotal()
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data?.url) {
        throw new Error("No checkout URL returned");
      }

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Form error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">Submit Card - {serviceType}</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Card {index + 1}</h2>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCard(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`cards.${index}.cardName`}
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
                    name={`cards.${index}.cardNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123/456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`cards.${index}.cardSet`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Set</FormLabel>
                        <FormControl>
                          <Input placeholder="Base Set" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            <Plus className="h-4 w-4 mr-2" />
            Add Another Card
          </Button>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Shipping Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="shipping.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.addressLine1"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/County</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price per card:</span>
                  <span>{pricePerCard} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of cards:</span>
                  <span>{fields.length}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>{calculateTotal()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </Button>
        </form>
      </Form>
    </div>
  );
}