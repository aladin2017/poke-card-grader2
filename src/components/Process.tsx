import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "Trimite Cartonașele",
    description: "Împachetează și trimite-ne cartonașele tale într-un mod sigur și protejat."
  },
  {
    title: "Evaluare Profesională",
    description: "Experții noștri evaluează fiecare cartonaș conform standardelor internaționale."
  },
  {
    title: "Gradare și Raport",
    description: "Primești un raport detaliat și cartonașele tale gradate în capsule protective."
  }
];

export const Process = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Procesul de Gradare
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-primary h-6 w-6" />
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};