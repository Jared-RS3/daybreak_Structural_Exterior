import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/template/PageHeader";
import { BeforeAfter } from "@/components/template/BeforeAfter";
import { CaseStudyCard, Specs } from "@/components/template/CaseStudy";
import { CtaBand } from "@/components/template/CtaBand";
import { Illustrative, Initials, JsonLd, PillLink, SectionIntro, Stars } from "@/components/template/primitives";
import { InspectActions } from "@/components/tools/InspectActions";
import { Img } from "@/components/ui/Img";
import { milesBetween } from "@/lib/template/geo";
import { breadcrumbLd } from "@/lib/template/schema";
import {
  areaBySlug,
  company,
  demoBase,
  homeHref,
  houseImage,
  projectBySlug,
  projects,
  reviewById,
  services,
  siteUrl,
  quoteCta,
  tool,
} from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = projectBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.location}`,
    description: `${p.problem} ${p.result}`.slice(0, 158),
    alternates: { canonical: `${demoBase}/projects/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const p = projectBySlug((await params).slug);
  if (!p) notFound();

  const review = p.reviewId ? reviewById(p.reviewId) : undefined;
  const area = areaBySlug(p.areaSlug);
  const service = services.find((s) => s.projectCategories.includes(p.category));

  // "Nearby" really is nearby: sorted by distance between project areas.
  const nearby = projects
    .filter((o) => o.slug !== p.slug)
    .map((o) => {
      const a = areaBySlug(o.areaSlug);
      return { o, d: a && area ? milesBetween(a, area) : 999 };
    })
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map((x) => x.o);

  const url = `${siteUrl}/projects/${p.slug}`;
  const sizes = "(min-width:1312px) 1232px, 100vw";

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Home", href: homeHref },
          { name: "Projects", href: `${demoBase}/projects` },
          { name: p.location },
        ]}
        kicker={`${p.location} · ${p.category}${p.insurance ? " · Insurance claim" : ""}`}
        title={p.title}
        facts={[
          { label: "Size", value: p.size },
          { label: "On site", value: `${p.days} ${p.days === 1 ? "day" : "days"}` },
        ]}
      />

      <section aria-label="Project photographs" className="relative -mt-12 sm:-mt-16">
        <div className="container-x">
          <div className="rounded-[32px] bg-card p-2 sm:p-2.5">
            {p.beforeAfter ? (
              <BeforeAfter
                before={{
                  label: p.beforeAfter.before.label,
                  node: <Img src={p.beforeAfter.before.src} alt={p.beforeAfter.before.alt} priority sizes={sizes} />,
                }}
                after={{
                  label: p.beforeAfter.after.label,
                  node: <Img src={p.beforeAfter.after.src} alt={p.beforeAfter.after.alt} priority sizes={sizes} />,
                }}
                note={p.beforeAfter.placeholderNote}
                className="aspect-[4/3] sm:aspect-[16/9]"
              />
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] sm:aspect-[16/9]">
                <Img src={p.image.src} alt={p.image.alt} priority sizes={sizes} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="story-title" className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <h2 id="story-title" className="sr-only">
            The project
          </h2>
          <div className="mb-8 flex justify-center">
            <Illustrative>Illustrative project — fictional contractor</Illustrative>
          </div>
          <ol className="grid gap-3 md:grid-cols-3">
            {[
              ["The problem", p.problem],
              ["What we did", p.solution],
              ["The result", p.result],
            ].map(([k, v], i) => (
              <li key={k} className="rounded-[28px] bg-card p-7 sm:p-8">
                <span className="flex size-9 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-fg">
                  {i + 1}
                </span>
                <h3 className="home-title mt-5 text-[22px] text-fg">{k}</h3>
                <p className="mt-2 text-[16px] leading-[1.6] text-muted">{v}</p>
              </li>
            ))}
          </ol>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-[28px] bg-card p-7 sm:p-8">
              <p className="text-[14px] text-muted">The specification</p>
              <Specs project={p} className="mt-4 [&_dl>div]:bg-white" />
            </div>
            {review && (
              <figure className="rounded-[28px] bg-sky-4 p-7 sm:p-8">
                <Stars count={review.rating} />
                <p className="home-title mt-4 text-[24px] text-fg">{review.headline}</p>
                <blockquote className="mt-2.5 text-[16px] leading-[1.6] text-fg/75">&ldquo;{review.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-[14px]">
                  <Initials name={review.name} className="bg-white" />
                  <span>
                    <span className="block text-fg">{review.name}</span>
                    <span className="block text-fg/70">
                      {review.city} · {review.source} review
                    </span>
                  </span>
                </figcaption>
              </figure>
            )}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {service && (
              <PillLink href={`${demoBase}/services/${service.slug}`} variant="soft">
                About our {service.title.toLowerCase()} work
              </PillLink>
            )}
            {area?.page && (
              <PillLink href={`${demoBase}/areas/${area.slug}`} variant="soft">
                Foundation repair in {area.city}
              </PillLink>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="nearby-title" className="bg-white pb-24 sm:pb-28">
        <div className="container-x">
          <SectionIntro id="nearby-title" label="More projects" title="Nearby, recently." align="left" />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((o) => (
              <CaseStudyCard key={o.slug} project={o} href={`${demoBase}/projects/${o.slug}`} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        kicker="Free inspections, written prices"
        title="Start with a free inspection."
        lede="Tell us what you're seeing. We'll measure it, photograph it and price it in writing. Not sure it's serious? Check your crack online first."
        action={<InspectActions book={quoteCta} check={{ label: "Check my crack online", href: tool.href }} />}
        secondary={{ label: "Book an inspection", href: `${demoBase}/book` }}
        contact={{ prefix: "or call", label: company.phoneDisplay, href: company.phoneHref }}
        house={{ ...houseImage, alt: "" }}
      />

      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: siteUrl },
          { name: "Projects", url: `${siteUrl}/projects` },
          { name: p.title, url },
        ])}
      />
    </>
  );
}
