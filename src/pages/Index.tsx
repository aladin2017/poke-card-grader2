import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { PopulationReport } from "@/components/PopulationReport";
import { CardVerification } from "@/components/CardVerification";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <CardVerification />
      <Process />
      <PopulationReport />
      <Pricing />
      <FAQ />
    </main>
  );
};

export default Index;