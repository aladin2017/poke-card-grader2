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
          <DialogContent className="w-full max-w-3xl p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">Începe Procesul de Gradare</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Completează formularul de mai jos și te vom contacta pentru detalii.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(80vh-10rem)] pr-2 relative">
              <GradingForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};