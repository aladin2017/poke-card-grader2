import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Plus, Trash2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const cardSchema = z.object({
  description: z.string().min(10, {
    message: "Descrierea trebuie să aibă cel puțin 10 caractere.",
  }),
  condition: z.string().min(1, {
    message: "Vă rugăm selectați starea cartonașului.",
  }),
})

const formSchema = z.object({
  cards: z.array(cardSchema).min(1, {
    message: "Adăugați cel puțin un cartonaș.",
  }),
  package: z.string({
    required_error: "Vă rugăm selectați un pachet de servicii.",
  }),
  shipping: z.string({
    required_error: "Vă rugăm selectați o metodă de expediere.",
  }),
  // Billing/Shipping details
  fullName: z.string().min(2, {
    message: "Numele trebuie să aibă cel puțin 2 caractere.",
  }),
  email: z.string().email({
    message: "Vă rugăm introduceți o adresă de email validă.",
  }),
  phone: z.string().min(10, {
    message: "Vă rugăm introduceți un număr de telefon valid.",
  }),
  address: z.string().min(10, {
    message: "Adresa trebuie să aibă cel puțin 10 caractere.",
  }),
  city: z.string().min(2, {
    message: "Orașul trebuie să aibă cel puțin 2 caractere.",
  }),
  county: z.string().min(2, {
    message: "Județul trebuie să aibă cel puțin 2 caractere.",
  }),
  postalCode: z.string().min(6, {
    message: "Codul poștal trebuie să aibă cel puțin 6 caractere.",
  }),
})

const packages = [
  { id: "standard", name: "Standard", price: 15 },
  { id: "premium", name: "Premium", price: 25 },
  { id: "express", name: "Express", price: 40 },
]

const shipping = [
  { id: "standard", name: "Standard (3-5 zile)", price: 15 },
  { id: "express", name: "Express (24h)", price: 30 },
]

export function GradingForm() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cards: [{ description: "", condition: "" }],
      package: "",
      shipping: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      county: "",
      postalCode: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards",
  })

  const selectedPackage = form.watch("package")
  const selectedShipping = form.watch("shipping")
  const cards = form.watch("cards")

  const calculateTotal = () => {
    const packagePrice = packages.find(p => p.id === selectedPackage)?.price || 0
    const shippingPrice = shipping.find(s => s.id === selectedShipping)?.price || 0
    return (packagePrice * cards.length) + shippingPrice
  }

  const nextStep = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      setStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here we'll add Stripe integration later
    console.log(values)
    toast({
      title: "Comandă trimisă cu succes!",
      description: "Vă vom redirecționa către pagina de plată.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`cards.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descriere cartonaș #{index + 1}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descrieți cartonașul (nume, serie, stare etc.)"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`cards.${index}.condition`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Starea cartonașului</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectați starea" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mint">Mint (Perfect)</SelectItem>
                                <SelectItem value="near_mint">Near Mint (Aproape Perfect)</SelectItem>
                                <SelectItem value="excellent">Excellent (Excelent)</SelectItem>
                                <SelectItem value="good">Good (Bun)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Șterge cartonașul
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ description: "", condition: "" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adaugă cartonaș
            </Button>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="package"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pachet de servicii</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectați pachetul" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packages.map(pkg => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} - {pkg.price}€/cartonaș
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shipping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metoda de expediere</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectați metoda de expediere" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shipping.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name} - {option.price}€
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedPackage && selectedShipping && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cost gradare ({cards.length} cartonașe)</span>
                      <span>{packages.find(p => p.id === selectedPackage)?.price! * cards.length}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost expediere</span>
                      <span>{shipping.find(s => s.id === selectedShipping)?.price}€</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>{calculateTotal()}€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ion Popescu" {...field} />
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
                    <Input placeholder="email@exemplu.com" {...field} />
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
                    <Input placeholder="0712345678" {...field} />
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
                  <FormLabel>Adresa</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Strada, număr, bloc, scară, apartament"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oraș</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Județ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cod poștal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost gradare ({cards.length} cartonașe)</span>
                    <span>{packages.find(p => p.id === selectedPackage)?.price! * cards.length}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost expediere</span>
                    <span>{shipping.find(s => s.id === selectedShipping)?.price}€</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total de plată</span>
                    <span>{calculateTotal()}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Înapoi
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Continuă
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Finalizează comanda
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
