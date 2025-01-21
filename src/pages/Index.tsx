import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { PopulationReport } from "@/components/PopulationReport";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Process />
      <PopulationReport />
      <Pricing />
      <FAQ />
    </main>
  );
};

export default Index;