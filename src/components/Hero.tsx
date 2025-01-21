import { Button } from "@/components/ui/button";

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
        <Button size="lg" className="animate-fade-up">
          Începe Gradarea
        </Button>
      </div>
    </div>
  );
};