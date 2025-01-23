import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CardVerification } from "@/components/CardVerification";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Pricing />
      <CardVerification />
      <Process />
      <FAQ />
    </main>
  );
};

export default Index;