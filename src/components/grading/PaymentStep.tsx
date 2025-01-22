import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./formSchema";
import { CreditCard } from "lucide-react";

interface PaymentStepProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  totalAmount: number;
}

export function PaymentStep({ form, totalAmount }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-black/5 border-0">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Sumar comandă</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total de plată</span>
              <span>{totalAmount}€</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detalii plată</h3>
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Număr card</FormLabel>
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
                <FormLabel>Data expirare</FormLabel>
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
  );
}