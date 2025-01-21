import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Process />
      <Pricing />
      <FAQ />
    </main>
  );
};

export default Index;