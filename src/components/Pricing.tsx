import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "BULK",
    price: "12",
    features: [
      "1-35 Cards Minimum",
      "25-30 Business days estimate",
      "Every case sleeved",
      "Sub grades online included"
    ],
  },
  {
    name: "STANDARD",
    price: "15",
    features: [
      "1-35 Cards Minimum",
      "20-25 Business days estimate",
      "Every case sleeved",
      "Sub grades online included"
    ],
  },
  {
    name: "MEDIUM",
    price: "20",
    features: [
      "1-35 Cards Minimum",
      "20 Business days estimate",
      "Every case sleeved",
      "Sub grades online included"
    ],
  },
  {
    name: "PRIORITY",
    price: "25",
    features: [
      "1-35 Cards",
      "14 Business days estimate",
      "Every case sleeved",
      "Sub grades online included"
    ],
  },
  {
    name: "EXPRESS",
    price: "30",
    features: [
      "1-50 Cards",
      "8 Business days estimate",
      "Every case sleeved",
      "Sub grades online included"
    ],
  }
];

export const Pricing = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Pachete de Servicii
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow bg-white border-gray-200">
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
                <Button 
                  className="w-full mt-6"
                  variant="default"
                >
                  {plan.name === "STANDARD" ? "Submit Now" : "Purchase Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};