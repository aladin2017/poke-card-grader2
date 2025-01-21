import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Cât durează procesul de gradare?",
    answer: "Timpul de procesare variază în funcție de pachetul ales: 2 zile pentru Express, 5 zile pentru Premium și 10 zile pentru Standard."
  },
  {
    question: "Ce include evaluarea?",
    answer: "Evaluarea include verificarea stării cartonașului, autenticității, colțurilor, marginilor, suprafeței și centrării."
  },
  {
    question: "Cum sunt protejate cartonașele în timpul procesului?",
    answer: "Folosim mănuși speciale și manipulăm cartonașele într-un mediu controlat. După gradare, acestea sunt sigilate în capsule protective."
  },
  {
    question: "Ce tipuri de cartonașe acceptați?",
    answer: "Acceptăm cartonașe Pokemon, Magic: The Gathering, Yu-Gi-Oh! și alte TCG-uri populare."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Întrebări Frecvente
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};