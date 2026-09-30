import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/template/PageHeader";
import { CaseStudyCard } from "@/components/template/CaseStudy";
import { FaqSection } from "@/components/template/FaqSection";
import { CtaBand } from "@/components/template/CtaBand";
import { JsonLd, PillLink, SectionIntro } from "@/components/template/primitives";
import { InspectActions } from "@/components/tools/InspectActions";
import { Icon } from "@/components/ui/Icon";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/template/schema";
import { company, demoBase, homeHref, houseImage, projects, serviceBySlug, services, siteUrl, tool } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return {
    title: `${s.title} in ${company.locality}`,
    description: `${s.short} ${s.blurb}`.slice(0, 158),
    alternates: { canonical: `${demoBase}/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();

  const related = projects.filter((p) => s.projectCategories.includes(p.category)).slice(0, 3);
  const others = services.filter((o) => o.slug !== s.slug);
  // Foundation and crawl space book an inspection; siding asks for a quote.
  const book = {
    label: s.group === "specialty" ? "Book a free inspection" : "Get a free quote",
    href: `${demoBase}/book${s.problemId ? `?problem=${s.problemId}` : ""}`,
  };
  const url = `${siteUrl}/services/${s.slug}`;

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Home", href: homeHref },
          { name: "Services", href: `${homeHref}#services` },
          { name: s.title },
        ]}
        kicker={s.title}
        title={`${s.title} in ${company.address.city}`}
        lede={s.blurb}
        actions={
          s.leadsWith === "tool" ? (
            <InspectActions book={book} check={{ label: "Check my crack online", href: tool.href }} />
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PillLink href={book.href} variant="light" size="lg">
                {book.label}
              </PillLink>
              <PillLink href={company.phoneHref} variant="glass" size="lg">
                Call {company.phoneDisplay}
              </PillLink>
            </div>
          )
        }
        facts={[
          { label: s.priceFrom === "Free" ? "Price" : "From", value: s.priceFrom },
          { label: "Timeline", value: s.timeline },
        ]}
        image={{ src: s.image, alt: `${s.title} — a Daybreak crew at work` }}
      />

      <section aria-labelledby="included-title" className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionIntro
            id="included-title"
            label="What's included"
            title="What you're actually paying for."
            lede="No vague line items. Each of these is on the written proposal, priced separately."
          />
          <ol className="mx-auto mt-14 grid max-w-5xl gap-3 sm:grid-cols-2">
            {s.includes.map((inc, i) => (
              <li key={inc.title} className="rounded-[28px] bg-card p-7 sm:p-8">
                <span className="flex size-9 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-fg">
                  {i + 1}
                </span>
                <h3 className="home-title mt-5 text-[21px] text-fg">{inc.title}</h3>
                <p className="mt-2 text-[15.5px] leading-[1.6] text-muted">{inc.body}</p>
              </li>
            ))}
          </ol>
          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
            {s.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-[14.5px] text-fg">
                <Icon name="check" className="size-4" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-white pb-24 sm:pb-28">
          <div className="container-x">
            <SectionIntro
              id="related-title"
              label="Recent work"
              title="Jobs like this one, finished."
              align="left"
              aside={
                <PillLink href={`${demoBase}/projects`} variant="soft">
                  All projects
                </PillLink>
              }
            />
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <CaseStudyCard key={p.slug} project={p} href={`${demoBase}/projects/${p.slug}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqSection id="service-faq" items={s.faqs} contact={{ prompt: "Can’t find your answer? Ask an inspector directly.", label: `Call ${company.phoneDisplay}`, href: company.phoneHref }} title={<>Questions about {s.title.toLowerCase()}.</>} />

      <nav aria-label="Other services" className="bg-white pb-24">
        <div className="container-x text-center">
          <p className="text-[15px] text-muted">Other services</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {others.map((o) => (
              <li key={o.slug}>
                <PillLink href={`${demoBase}/services/${o.slug}`} variant="soft" size="lg">
                  {o.title}
                </PillLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CtaBand
        kicker="Free inspections, written prices"
        title="Let's take a look at your home."
        lede={
          s.group === "specialty"
            ? "Not sure it's serious? Check your crack online first, or book a free inspection and elevation survey."
            : "Tell us what's happening with your siding and we'll inspect it and price it in writing."
        }
        action={<InspectActions book={book} check={s.group === "specialty" ? { label: "Check my crack online", href: tool.href } : undefined} />}
        contact={{ prefix: "or call", label: company.phoneDisplay, href: company.phoneHref }}
        house={{ ...houseImage, alt: "" }}
      />

      <JsonLd
        data={[
          serviceLd(company, s, url, company.region),
          faqLd(s.faqs),
          breadcrumbLd([
            { name: "Home", url: siteUrl },
            { name: s.title, url },
          ]),
        ]}
      />
    </>
  );
}
