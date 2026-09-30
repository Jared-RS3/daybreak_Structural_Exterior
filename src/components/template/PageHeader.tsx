import type { ImageRef } from "@/lib/template/types";
import { Img } from "@/components/ui/Img";
import { Crumbs, PillLabel } from "./primitives";

/**
 * Inner-page opening in the same sky as the homepage, shorter: breadcrumb,
 * pill, one H1, the lede, the page's next step. The photograph, when there is
 * one, sits in a rounded frame that overlaps the sky and the white page below
 * it, so the two halves read as one composition.
 */
export function PageHeader({
  crumbs,
  kicker,
  title,
  lede,
  actions,
  facts,
  image,
}: {
  crumbs: { name: string; href?: string }[];
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  /** Short figures under the actions, as white chips. */
  facts?: { label: string; value: string }[];
  image?: ImageRef;
}) {
  return (
    <section className="relative">
      <div className={"sky-page relative -mt-[72px] pt-[72px] " + (image ? "pb-40 sm:pb-56" : "pb-20 sm:pb-24")}>
        <div className="container-x pt-8">
          <Crumbs trail={crumbs} tone="light" />
          <div className="mx-auto max-w-3xl pt-12 text-center sm:pt-16">
            <PillLabel tone="sky">{kicker}</PillLabel>
            <h1 className="home-display mt-6 text-[clamp(2.6rem,5.6vw,4.75rem)] text-white">{title}</h1>
            {lede && <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.6] text-white sm:text-[18px]">{lede}</p>}
            {actions && <div className="mx-auto mt-9 max-w-[36rem]">{actions}</div>}
            {facts && (
              <dl className="mt-9 flex flex-wrap justify-center gap-2">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-full bg-white/15 px-4 py-2 text-[14px] text-white">
                    <dt className="inline text-white/85">{f.label}: </dt>
                    <dd className="inline font-medium tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
        <span id="header-overlay-end" aria-hidden className="absolute bottom-0" />
      </div>
      {image && (
        <div className="container-x -mt-28 sm:-mt-44">
          <div className="rounded-[32px] bg-card p-2 sm:p-2.5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] sm:aspect-[21/9]">
              <Img src={image.src} alt={image.alt} priority sizes="(min-width:1312px) 1232px, 100vw" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
