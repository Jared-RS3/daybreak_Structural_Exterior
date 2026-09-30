import type { Metadata } from "next";
import { Hero } from "@/components/template/Hero";
import { ToolSection } from "@/components/template/ToolSection";
import { ProofRail } from "@/components/template/ProofRail";
import { Chapter } from "@/components/template/Chapter";
import { ProblemSelector } from "@/components/template/ProblemSelector";
import { CaseStudyCard, CaseStudyLead } from "@/components/template/CaseStudy";
import { Comparison } from "@/components/template/Comparison";
import { ProcessSteps } from "@/components/template/ProcessSteps";
import { ServiceGrid } from "@/components/template/ServiceGrid";
import { ReviewWall } from "@/components/template/ReviewWall";
import { AreaMap } from "@/components/template/AreaMap";
import { Guarantees } from "@/components/template/Guarantees";
import { FaqSection } from "@/components/template/FaqSection";
import { CtaBand } from "@/components/template/CtaBand";
import { JsonLd, PillLink } from "@/components/template/primitives";
import { CrackChecker } from "@/components/tools/CrackChecker";
import { CrackChip } from "@/components/tools/CrackChip";
import { Img } from "@/components/ui/Img";
import { contractorLd, faqLd } from "@/lib/template/schema";
import {
  areas,
  company,
  comparison,
  demoBase,
  homeHref,
  faqs,
  guarantees,
  houseImage,
  problems,
  processSteps,
  projectBySlug,
  projects,
  proof,
  quoteCta,
  rating,
  reviewById,
  reviews,
  services,
  siteUrl,
  tool,
  trust,
} from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Foundation Repair, Crawl Space & Siding in ${company.locality} | ${company.name} (reference build)`,
  },
  description:
    "Foundation repair, crawl space encapsulation and siding across the DFW Metroplex. Check a crack online in 30 seconds, or book a free inspection and elevation survey.",
  alternates: { canonical: homeHref },
};

/** The two hero actions: the free inspection first, the crack checker beside it. */
function HeroActions() {
  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <PillLink href={quoteCta.href} variant="light" size="lg">
        {quoteCta.label}
      </PillLink>
      <PillLink href={`${homeHref}#checker`} variant="glass" size="lg">
        {tool.cta} online
      </PillLink>
    </div>
  );
}

/**
 * Ordered by the homeowner's decision, not the company's brochure: who you
 * are and what you do (hero, services) → is it real (proof) → the tool that
 * makes you different → what's wrong with mine (problems) → show me
 * (projects) → why you (the process, contrasted) → who says so (reviews) →
 * do you come to me (area) → what if it goes wrong (commitments) → leftover
 * questions → the quote again.
 */
export default function Home() {
  const lead = projectBySlug("arlington-brick-ranch-piers")!;
  const more = ["aledo-farmhouse-crawl", "westover-hardie-siding", "fairmount-pier-beam"]
    .map(projectBySlug)
    .filter((p) => p !== undefined);
  const carousel = ["marcus", "priya", "tamika"].map(reviewById).filter((r) => r !== undefined);

  return (
    <>
      <Hero
        kicker={`Foundation, crawl space & siding · ${company.locality}`}
        title="What holds your home up, and what keeps it dry."
        lede="Foundation repair, crawl space encapsulation and new siding. One local crew that measures first, and tells you what needs doing and what doesn't."
        action={<HeroActions />}
        contact={{ prefix: "or call", label: company.phoneDisplay, href: company.phoneHref }}
        house={houseImage}
        inset={<CrackChip href="#checker" />}
        trust={trust}
      />

      <Chapter
        id="services"
        label="Services"
        title="From the ground up, and the walls around it."
        lede="Settling foundations, sagging floors and damp crawl spaces — and the siding that keeps water out of the walls. We'll tell you what needs fixing and what doesn't."
      >
        <ServiceGrid
          services={services}
          base={demoBase}
          labels={{ specialty: "Foundation & crawl space", more: "Siding & exterior" }}
        />
      </Chapter>

      <ProofRail
        items={proof}
        projects={projects}
        reviews={reviews}
        base={demoBase}
        title="Don't take our word for it."
        lede="Recent foundation, crawl space and siding jobs across Tarrant, Denton and Parker counties — where they are, how big, how long they took, and what the owners said."
      />

      <ToolSection
        id="checker"
        tool={tool}
        title="Is that crack serious?"
        lede="Four quick questions, and you'll know how worried to be, what's usually behind it, and what a fix typically costs in North Texas — before anyone schedules anything."
        showcase={
          <CrackChecker
            bookHref={quoteCta.href}
            phone={{ display: company.phoneDisplay, href: company.phoneHref }}
          />
        }
      />

      <Chapter
        id="problems"
        label="Where to start"
        title="What does your home need?"
        lede="Pick the closest. We'll tell you what it usually turns out to be, and what we'd do first."
      >
        <ProblemSelector
          problems={problems}
          business={company}
          media={problems.map((p) => (
            <Img key={p.id} src={p.image.src} alt={p.image.alt} sizes="(min-width:1024px) 42vw, 100vw" />
          ))}
        />
      </Chapter>

      <Chapter
        id="work"
        label="Projects"
        title="Recent work, and what it took to get it right."
        lede="Every project answers the same five questions: where, what was wrong, what we did, how it turned out, and who says so."
      >
        <CaseStudyLead
          project={lead}
          review={lead.reviewId ? reviewById(lead.reviewId) : undefined}
          href={`${demoBase}/projects/${lead.slug}`}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((p) => (
            <CaseStudyCard key={p.slug} project={p} href={`${demoBase}/projects/${p.slug}`} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <PillLink href={`${demoBase}/projects`} variant="soft">
            See all projects
          </PillLink>
        </div>
      </Chapter>

      <Comparison
        data={comparison}
        title="Getting a quote shouldn't take seven phone calls."
        lede="Usually it means calling around, waiting for callbacks and taking a morning off for a sales visit. Most of that is waiting, and most of the waiting is avoidable."
      />

      <ProcessSteps
        steps={processSteps}
        icons={["message", "search", "foundation"]}
        title="From first call to finished job, in three steps."
      />

      <ReviewWall
        rating={rating}
        featured={carousel}
        marquee={reviews.filter((r) => !carousel.includes(r))}
        lede="Stories from homeowners who stopped worrying about the cracks."
      />

      <Chapter
        id="areas"
        label="Service area"
        title="We're probably already working in your neighborhood."
        lede={`Crews leave our ${company.address.city} yard every morning for ${areas.length} towns across four counties. Pick yours to see the nearest recent job and how soon we can come out.`}
      >
        <AreaMap areas={areas} projects={projects} business={company} base={demoBase} toolHref={quoteCta.href} initial="keller" />
      </Chapter>

      <Guarantees
        items={guarantees}
        title="What we put in writing."
        lede="Any job on your home is a big purchase from someone you've just met. These are the terms in every contract, so you're relying on paper, not a handshake."
        footnote={
          <p className="text-[15px] text-muted">
            <span className="font-medium text-fg">Financing:</span> 12 months at 0% APR, or longer terms from 5.99% APR, on
            approved credit.
          </p>
        }
      />

      <FaqSection items={faqs} contact={{ prompt: "Can’t find your answer? Ask an inspector directly.", label: `Call ${company.phoneDisplay}`, href: company.phoneHref }} />

      <CtaBand
        kicker="Free inspections, written prices"
        title="Let's take a look at your home."
        lede="Cracks, sagging floors, a damp crawl space or tired siding — tell us what you're seeing and we'll measure it and price it in writing."
        action={<HeroActions />}
        contact={{ prefix: "or call", label: company.phoneDisplay, href: company.phoneHref }}
        house={{ ...houseImage, alt: "" }}
      />

      <JsonLd data={[contractorLd(company, siteUrl, areas), faqLd(faqs)]} />
    </>
  );
}
