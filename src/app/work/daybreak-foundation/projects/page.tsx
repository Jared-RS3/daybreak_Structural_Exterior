import type { Metadata } from "next";
import { PageHeader } from "@/components/template/PageHeader";
import { CaseStudyCard } from "@/components/template/CaseStudy";
import { CtaBand } from "@/components/template/CtaBand";
import { Illustrative } from "@/components/template/primitives";
import { InspectActions } from "@/components/tools/InspectActions";
import { company, demoBase, homeHref, houseImage, projects, quoteCta, tool } from "@/lib/site";

export const metadata: Metadata = {
  title: `Recent Foundation, Crawl Space & Siding Projects in ${company.locality}`,
  description:
    "Foundation repairs, crawl space encapsulations and siding jobs across the DFW Metroplex — each with the location, the problem, what was done and how it turned out.",
  alternates: { canonical: `${demoBase}/projects` },
};

export default function ProjectsPage() {
  const [first, ...rest] = projects;

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: homeHref }, { name: "Projects" }]}
        kicker="Projects"
        title="Recent work, with the details."
        lede="Every project answers the same five questions: where it is, what was wrong, what we did, how it turned out, and who says so."
      />

      <section aria-label="All projects" className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="mb-8 flex justify-center">
            <Illustrative>Illustrative projects — fictional contractor</Illustrative>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <CaseStudyCard
                project={first}
                href={`${demoBase}/projects/${first.slug}`}
                aspect="aspect-[16/10]"
                sizes="(min-width:1024px) 62vw, 100vw"
              />
            </div>
            {rest.map((p) => (
              <CaseStudyCard key={p.slug} project={p} href={`${demoBase}/projects/${p.slug}`} />
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
    </>
  );
}
