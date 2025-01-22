import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formSchema } from "./grading/formSchema";
import { PersonalInfoStep } from "./grading/PersonalInfoStep";
import { ServiceSelection } from "./grading/ServiceSelection";
import { CardsList } from "./grading/CardsList";
import { PaymentStep } from "./grading/PaymentStep";

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (step === 1) {
        const formData = form.getValues();
        const isValid = await form.trigger();
        
        if (!formData.serviceType || !formData.shippingMethod) {
          toast({
            title: "Eroare de validare",
            description: "Vă rugăm să selectați tipul de serviciu și metoda de livrare.",
            variant: "destructive",
          });
          return;
        }
        
        if (isValid) {
          setStep(2);
        } else {
          toast({
            title: "Eroare de validare",
            description: "Vă rugăm să completați toate câmpurile obligatorii.",
            variant: "destructive",
          });
        }
        return;
      }

      if (step === 2) {
        const isCardsValid = values.cards.every(card => 
          card.name && card.year && card.set
        );

        if (!isCardsValid) {
          toast({
            title: "Eroare de validare",
            description: "Vă rugăm să completați toate informațiile necesare pentru cărți.",
            variant: "destructive",
          });
          return;
        }
        setStep(3);
        return;
      }

      // Final submission
      const order = {
        ...values,
        status: "pending",
        createdAt: new Date().toISOString(),
        totalAmount: calculateTotal(values),
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
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la procesarea formularului. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <Progress value={((step - 1) / 2) * 100} className="h-1 bg-gray-800" />
          <div className="flex justify-between text-sm">
            <span className={step === 1 ? "text-pink-500" : "text-gray-500"}>Detalii</span>
            <span className={step === 2 ? "text-pink-500" : "text-gray-500"}>Carduri</span>
            <span className={step === 3 ? "text-pink-500" : "text-gray-500"}>Plată</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <PersonalInfoStep form={form} />
            <ServiceSelection form={form} />
          </div>
        )}

        {step === 2 && (
          <CardsList 
            form={form}
            fields={fields}
            onAddCard={addCard}
            onRemoveCard={removeCard}
          />
        )}

        {step === 3 && (
          <PaymentStep 
            form={form}
            totalAmount={calculateTotal(form.getValues())}
          />
        )}

        <div className="flex justify-between gap-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="bg-transparent"
            >
              Înapoi
            </Button>
          )}
          <Button
            type="submit"
            className={`${step === 3 ? 'bg-pink-500 hover:bg-pink-600' : 'bg-pink-500 hover:bg-pink-600'} ${step === 1 ? "w-full" : ""}`}
          >
            {step === 3 ? `Plătește ${calculateTotal(form.getValues())}€` : "Continuă"}
          </Button>
        </div>
      </form>
    </Form>
  );
}