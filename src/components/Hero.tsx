import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="animate-fade-up">
              Începe Gradarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Începe Procesul de Gradare</DialogTitle>
              <DialogDescription>
                Completează formularul de mai jos și te vom contacta pentru detalii.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <GradingForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};