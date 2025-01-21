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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
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
  package: z.enum(["standard", "premium"], {
    required_error: "Vă rugăm să selectați un pachet.",
  }),
  cards: z.array(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      year: z.string().optional(),
      set: z.string().optional(),
      condition: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  shippingAddress: z.string().min(10, {
    message: "Adresa trebuie să conțină cel puțin 10 caractere.",
  }),
});

export function GradingForm() {
  const { toast } = useToast();
  const [cards, setCards] = useState([{ id: "1" }]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      package: "standard",
      cards: [{ id: "1" }],
      shippingAddress: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "cards",
    control: form.control,
  });

  const addCard = () => {
    const newId = (cards.length + 1).toString();
    setCards([...cards, { id: newId }]);
    append({ id: newId });
  };

  const removeCard = (index: number) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
    remove(index);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Store the order in localStorage
    const existingOrders = localStorage.getItem('gradingOrders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(data);
    localStorage.setItem('gradingOrders', JSON.stringify(orders));

    toast({
      title: "Comandă plasată cu succes!",
      description: "Vă mulțumim pentru comandă. Veți primi un email de confirmare în curând.",
    });

    form.reset();
    setCards([{ id: "1" }]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume complet</FormLabel>
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
          name="package"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pachet</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectați un pachet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">Standard (€15/card)</SelectItem>
                  <SelectItem value="premium">Premium (€25/card)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Pachetul premium include procesare prioritară și raport detaliat.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Cărți pentru evaluare</FormLabel>
            <Button type="button" variant="outline" onClick={addCard}>
              Adaugă carte
            </Button>
          </div>

          {fields.map((card, index) => (
            <Card key={card.id}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">Carte #{index + 1}</span>
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

                  <FormField
                    control={form.control}
                    name={`cards.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume carte</FormLabel>
                        <FormControl>
                          <Input placeholder="Charizard" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <FormField
                    control={form.control}
                    name={`cards.${index}.condition`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stare</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectați starea" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mint">Mint</SelectItem>
                            <SelectItem value="near-mint">Near Mint</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`cards.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note adiționale</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detalii despre carte..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <FormField
          control={form.control}
          name="shippingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresă de livrare</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Strada, Număr, Bloc, Scară, Apartament, Oraș, Județ, Cod Poștal"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Trimite pentru evaluare
        </Button>
      </form>
    </Form>
  );
}