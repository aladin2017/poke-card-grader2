import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./formSchema";

interface PersonalInfoStepProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nume complet</FormLabel>
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
            <FormLabel>Telefon</FormLabel>
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
            <FormLabel>Adresă</FormLabel>
            <FormControl>
              <Input placeholder="Strada Principală 123" className="bg-black/5 border-0" {...field} />
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
              <Input placeholder="București" className="bg-black/5 border-0" {...field} />
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
              <Input placeholder="Sector 1" className="bg-black/5 border-0" {...field} />
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
            <FormLabel>Cod poștal</FormLabel>
            <FormControl>
              <Input placeholder="010101" className="bg-black/5 border-0" {...field} />
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
              <Input placeholder="România" className="bg-black/5 border-0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}