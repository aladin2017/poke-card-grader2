import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./formSchema";
import { X } from "lucide-react";

interface CardsListProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  fields: any[];
  onAddCard: () => void;
  onRemoveCard: (index: number) => void;
}

export function CardsList({ form, fields, onAddCard, onRemoveCard }: CardsListProps) {
  return (
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
                    onClick={() => onRemoveCard(index)}
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
                      <FormLabel>Nume card</FormLabel>
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
                      <FormLabel>An</FormLabel>
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
                      <FormLabel>Număr card (opțional)</FormLabel>
                      <FormControl>
                        <Input placeholder="4/102" className="bg-black/5 border-0" {...field} />
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
        onClick={onAddCard}
      >
        Adaugă alt card
      </Button>
    </div>
  );
}