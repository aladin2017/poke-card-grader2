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
  },
];

export const Pricing = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Pachete de Servicii
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-center">{plan.name}</CardTitle>
                <div className="text-5xl font-bold text-center text-[#00ff00] mt-4">{plan.price}</div>
                <div className="text-sm text-gray-400 text-center">EUR Per Card</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mt-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <Check className="text-[#00ff00] h-5 w-5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-8 bg-transparent hover:bg-[#00ff00] text-[#00ff00] hover:text-black border border-[#00ff00] transition-colors"
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