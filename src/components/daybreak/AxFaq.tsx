import type { Faq } from "@/lib/template/types";
import { FaqList } from "@/components/template/FaqList";
import { AxButton, AxLabel } from "./ax";

/** Large left-set heading, square-chevron questions, a human at the bottom. */
export function AxFaq({ items, email }: { items: Faq[]; email: string }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <div className="border-t border-rule pt-6">
          <AxLabel>Questions</AxLabel>
        </div>
        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12">
          <h2 id="faq-title" className="font-home text-[clamp(2.2rem,4.2vw,3.5rem)] font-normal leading-[1.08] tracking-[-0.03em] text-fg lg:col-span-4">
            Frequently
            <br /> asked questions.
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={items} variant="square" />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-panel p-5">
              <p className="text-[17px] text-fg">Can&rsquo;t find your answer? A founder will reply.</p>
              <AxButton href={`mailto:${email}`}>Email us</AxButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
