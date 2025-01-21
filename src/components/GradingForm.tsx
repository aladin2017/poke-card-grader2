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
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const cardSchema = z.object({
  name: z.string().min(2, {
    message: "Numele cartonașului trebuie să aibă cel puțin 2 caractere.",
  }),
  series: z.string().regex(/^\d+\/\d+$/, {
    message: "Seria trebuie să fie în format număr/număr (ex: 104/202).",
  }),
  set: z.string().min(2, {
    message: "Setul trebuie să aibă cel puțin 2 caractere.",
  }),
  year: z.string().min(4, {
    message: "Anul trebuie să aibă 4 caractere.",
  }),
  language: z.string().min(2, {
    message: "Limba trebuie să aibă cel puțin 2 caractere.",
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cards: [{ name: "", series: "", set: "", year: "", language: "" }],
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

  const validateStep = async (currentStep: number) => {
    let isValid = true;
    
    switch(currentStep) {
      case 1:
        isValid = await form.trigger(['cards', 'package', 'shipping']);
        break;
      case 2:
        isValid = await form.trigger([
          'fullName',
          'email',
          'phone',
          'address',
          'city',
          'county',
          'postalCode'
        ]);
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Eroare de validare",
        description: "Vă rugăm să completați toate câmpurile obligatorii corect.",
      })
    }

    return isValid;
  }

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const goToStep = async (stepNumber: number) => {
    if (stepNumber < step) {
      setStep(stepNumber);
      return;
    }

    for (let i = 1; i < stepNumber; i++) {
      const isValid = await validateStep(i);
      if (!isValid) {
        return;
      }
    }
    
    setStep(stepNumber);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log(values)
      toast({
        title: "Comandă trimisă cu succes!",
        description: "Vă vom redirecționa către pagina de plată.",
      })
      
      form.reset()
      setStep(1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "A apărut o eroare la trimiterea comenzii. Vă rugăm să încercați din nou.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    "Cartonașe",
    "Date Personale",
    "Finalizare"
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((stepName, idx) => (
              <Button
                key={stepName}
                variant="ghost"
                onClick={() => goToStep(idx + 1)}
                className={`${
                  step === idx + 1 
                    ? "text-primary border-b-2 border-primary rounded-none" 
                    : "text-gray-400"
                }`}
                disabled={isSubmitting}
              >
                {stepName}
              </Button>
            ))}
          </div>
          <Progress value={(step / steps.length) * 100} className="h-2" />
        </div>

        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`cards.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nume cartonaș #{index + 1}</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Charizard" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`cards.${index}.series`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seria cartonașului</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 104/202" {...field} />
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
                              <Input placeholder="Ex: Sword & Shield" {...field} />
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
                              <Input placeholder="Ex: 1999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`cards.${index}.language`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Limbă</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Engleză" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Șterge cartonașul
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: "", series: "", set: "", year: "", language: "" })}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adaugă cartonaș
                </Button>

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
                <Card className="bg-primary/5 border-primary/20">
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
                      <div className="flex justify-between font-bold pt-2 border-t border-primary/20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>Adresa</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Strada, număr, bloc, scară, apartament"
                        className="resize-none"
                        {...field}
                      />
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
              <Card className="bg-primary/5 border-primary/20">
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
                    <div className="flex justify-between font-bold pt-2 border-t border-primary/20">
                      <span>Total de plată</span>
                      <span>{calculateTotal()}€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          {step > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi
            </Button>
          )}
          {step < 3 ? (
            <Button 
              type="button" 
              onClick={nextStep} 
              className={`${step === 1 ? "w-full" : "ml-auto"}`}
              disabled={isSubmitting}
            >
              Continuă
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="ml-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Se procesează...
                </>
              ) : (
                "Finalizează comanda"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}