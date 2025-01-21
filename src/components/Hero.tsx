import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GradingForm } from "./GradingForm";

export const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container px-4 py-32 mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-fade-up">
          Servicii Premium de Gradare
          <br />
          Pokemon & Trading Cards
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto animate-fade-up">
          Expertiza profesională pentru evaluarea și autentificarea colecției tale de cartonașe.
          Servicii de încredere, rapoarte detaliate și manipulare atentă.
        </p>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="animate-fade-up">
              Începe Gradarea
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Începe Procesul de Gradare</SheetTitle>
              <SheetDescription>
                Completează formularul de mai jos și te vom contacta pentru detalii.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <GradingForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};