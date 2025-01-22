import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { UserRole } from "@/components/UserRole";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end p-4">
        <UserRole />
      </div>
      <Hero />
      <Process />
      <Pricing />
      <FAQ />
    </div>
  );
}