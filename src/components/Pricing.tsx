import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Standard",
    price: "15",
    features: ["Timp de procesare 10 zile", "Raport basic", "Capsulă protectivă standard"],
  },
  {
    name: "Premium",
    price: "25",
    features: ["Timp de procesare 5 zile", "Raport detaliat", "Capsulă premium", "Fotografii HD"],
  },
  {
    name: "Express",
    price: "40",
    features: ["Timp de procesare 2 zile", "Raport expert", "Capsulă premium+", "Fotografii HD", "Asigurare premium"],
  },
];

export const Pricing = () => {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Pachete de Servicii
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold">{plan.price} €<span className="text-lg text-gray-500">/cartonaș</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="text-primary h-5 w-5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6">Alege {plan.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};