import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/template/PageHeader";
import { CaseStudyCard } from "@/components/template/CaseStudy";
import { AreaMap } from "@/components/template/AreaMap";
import { FaqSection } from "@/components/template/FaqSection";
import { CtaBand } from "@/components/template/CtaBand";
import { Initials, JsonLd, PillLink, SectionIntro, Stars } from "@/components/template/primitives";
import { InspectActions } from "@/components/tools/InspectActions";
import { Icon } from "@/components/ui/Icon";
import { milesBetween } from "@/lib/template/geo";
import { breadcrumbLd, contractorLd } from "@/lib/template/schema";
import {
  areaBySlug,
  areas,
  company,
  demoBase,
  homeHref,
  faqs,
  houseImage,
  projects,
  reviews,
  services,
  siteUrl,
  quoteCta,
  tool,
} from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** Only areas with something local to say get a page — see `Area.page`. */
export const dynamicParams = false;

export function generateStaticParams() {
  return areas.filter((a) => a.page).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = areaBySlug((await params).slug);
  if (!a) return {};
  return {
    title: `Foundation Repair in ${a.city}, ${company.address.state} — Crawl Space & Siding Too`,
    description: `Foundation repair, crawl space encapsulation and siding in ${a.city}. Check a crack online, then book a free inspection — typical lead time ${a.leadTime.toLowerCase()}.`,
    alternates: { canonical: `${demoBase}/areas/${a.slug}` },
  };
}

export default async function AreaPage({ params }: Props) {
  const a = areaBySlug((await params).slug);
  if (!a || !a.page) notFound();

  const fromYard = Math.round(milesBetween(company.geo, a));
  const nearby = projects
    .map((p) => {
      const pa = areaBySlug(p.areaSlug);
      return { p, d: pa ? milesBetween(pa, a) : 999 };
    })
    .sort((x, y) => x.d - y.d)
    .slice(0, 3);
  const local = reviews.filter((r) => r.city === a.city);
  const localReviews = (local.length ? local : reviews).slice(0, 2);
  const url = `${siteUrl}/areas/${a.slug}`;

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Home", href: homeHref },
          { name: "Service area", href: `${homeHref}#areas` },
          { name: a.city },
        ]}
        kicker={`${a.county} County, ${company.address.state}`}
        title={`Foundation repair in ${a.city}`}
        lede={a.note}
        actions={<InspectActions book={quoteCta} check={{ label: "Check my crack online", href: tool.href }} />}
        facts={[
          { label: "From our yard", value: `${fromYard} mi` },
          { label: "Inspection lead time", value: a.leadTime },
        ]}
      />

      <section aria-labelledby="nearby-title" className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionIntro
            id="nearby-title"
            label={`Near ${a.city}`}
            title="The closest jobs we've finished."
            align="left"
            aside={
              <PillLink href={`${demoBase}/projects`} variant="soft">
                All projects
              </PillLink>
            }
          />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map(({ p, d }) => (
              <div key={p.slug} className="relative">
                <CaseStudyCard project={p} href={`${demoBase}/projects/${p.slug}`} />
                <span className="pill-label absolute left-5 top-5 bg-white/90 font-medium text-fg">
                  {d < 3 ? `In ${a.city}` : `${Math.round(d)} mi from ${a.city}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="services-title" className="bg-gradient-to-b from-white via-[#efefef] to-white py-24 sm:py-28">
        <div className="container-x">
          <SectionIntro id="services-title" label={`Services in ${a.city}`} title="What we do here." />
          <ul className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${demoBase}/services/${s.slug}`}
                  className="group flex h-full items-center gap-5 rounded-[24px] bg-white p-6 transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="home-title block text-[19px] text-fg">
                      {s.title} in {a.city}
                    </span>
                    <span className="mt-1 block text-[14.5px] text-muted">{s.short}</span>
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card transition-transform group-hover:translate-x-0.5">
                    <Icon name="arrowRight" className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-2">
            {localReviews.map((r) => (
              <li key={r.id}>
                <figure className="h-full rounded-[24px] bg-white p-7">
                  <Stars count={r.rating} />
                  <p className="home-title mt-4 text-[20px] text-fg">{r.headline}</p>
                  <blockquote className="mt-2 text-[15px] leading-[1.6] text-muted">&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-[14px]">
                    <Initials name={r.name} className="bg-card" />
                    <span>
                      <span className="block text-fg">{r.name}</span>
                      <span className="block text-muted">{r.city}</span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="map-title" className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionIntro id="map-title" label="Service area" title={`${a.city} and the towns around it.`} />
          <div className="mt-12">
            <AreaMap areas={areas} projects={projects} business={company} base={demoBase} toolHref={quoteCta.href} initial={a.slug} />
          </div>
        </div>
      </section>

      <FaqSection id="area-faq" items={faqs.slice(0, 5)} contact={{ prompt: "Can’t find your answer? Ask an inspector directly.", label: `Call ${company.phoneDisplay}`, href: company.phoneHref }} />

      <CtaBand
        kicker="Free inspections, written prices"
        title={`Free inspections in ${a.city}.`}
        lede="Tell us what you're seeing. We'll measure it, photograph it and price it in writing. Not sure it's serious? Check your crack online first."
        action={<InspectActions book={quoteCta} check={{ label: "Check my crack online", href: tool.href }} />}
        secondary={{ label: "Book an inspection", href: `${demoBase}/book` }}
        contact={{ prefix: "or call", label: company.phoneDisplay, href: company.phoneHref }}
        house={{ ...houseImage, alt: "" }}
      />

      <JsonLd
        data={[
          contractorLd(company, url, [a]),
          breadcrumbLd([
            { name: "Home", url: siteUrl },
            { name: `Foundation repair in ${a.city}`, url },
          ]),
        ]}
      />
    </>
  );
}
