import type { Guarantee } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Illustrative, PillLabel, SectionIntro } from "./primitives";

/**
 * Risk reversal, set as Crest sets its "why choose us" cards: white on a
 * soft grey fade, a line icon, the commitment in one line, the detail in
 * grey italic underneath. These are contract terms, not adjectives — and the
 * content file's are placeholders for the client's real ones.
 */
export function Guarantees({
  items,
  title,
  lede,
  footnote,
  label = "Our commitments",
  tag = <Illustrative>Illustrative terms</Illustrative>,
}: {
  label?: string;
  /** Marks placeholder terms on a demo; pass null for real ones. */
  tag?: React.ReactNode;
  items: Guarantee[];
  title: React.ReactNode;
  lede: React.ReactNode;
  footnote?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="guarantee-title" className="bg-gradient-to-b from-white to-[#efefef] py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <Reveal>
          <SectionIntro
            id="guarantee-title"
            label={
              <>
                <PillLabel>{label}</PillLabel>
                {tag}
              </>
            }
            title={title}
            lede={lede}
          />
        </Reveal>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {items.map((g) => (
            <li key={g.title} className="flex flex-col items-center rounded-[28px] bg-white px-7 py-9 text-center">
              <Icon name={g.icon ?? "check"} className="size-8 text-fg" />
              <h3 className="home-title mt-5 text-[19px] text-fg">{g.title}</h3>
              <p className="mt-2.5 text-[15px] italic leading-[1.55] text-muted">{g.body}</p>
            </li>
          ))}
        </ul>

        {footnote && <div className="mx-auto mt-8 max-w-3xl text-center">{footnote}</div>}
      </div>
    </section>
  );
}
