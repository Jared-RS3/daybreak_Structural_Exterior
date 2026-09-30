import type { Cta, Faq } from "@/lib/template/types";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "./FaqList";
import { pillClass } from "./pill";

/**
 * Crest's FAQ: a large left-set headline, the questions to its right, and a
 * closing line offering a human for the question that isn't on the list.
 * Kept because people ask these — cost, accuracy, insurance, crews — not to
 * give the page another section.
 */
export function FaqSection({
  id = "faq",
  items,
  contact,
  title = (
    <>
      Frequently
      <br /> asked questions.
    </>
  ),
}: {
  id?: string;
  items: Faq[];
  /** The human fallback: a phone number on a contractor site, an email on the agency's. */
  contact: Cta & { prompt: string };
  title?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 bg-white py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <h2 id={`${id}-title`} className="home-heading text-[clamp(2.4rem,4.6vw,3.6rem)] text-fg">
              {title}
            </h2>
          </Reveal>
          <div className="lg:col-span-8">
            <FaqList items={items} />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[16px] text-fg">{contact.prompt}</p>
              <a href={contact.href} className={pillClass("dark", "md")}>
                {contact.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
