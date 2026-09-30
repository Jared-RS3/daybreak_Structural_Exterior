import { InspectionForm } from "@/components/template/InspectionForm";
import { Crumbs, PillLabel } from "@/components/template/primitives";
import { Icon } from "@/components/ui/Icon";
import {
  company,
  demoBase,
  homeHref,
  illustrative,
  problems,
  processSteps,
  tool,
} from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Inspection",
  description: `Free foundation, crawl space and siding inspections in ${company.locality}. A specialist comes out, measures it properly, and prices it in writing.`,
  alternates: { canonical: `${demoBase}/book` },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ problem?: string }>;
}) {
  const { problem } = await searchParams;
  const initial = problems.some((p) => p.id === problem) ? problem : undefined;

  return (
    <section className="bg-white pb-24 pt-8 lg:pb-32 lg:pt-10">
      <div className="container-x">
        <Crumbs
          trail={[
            { name: "Home", href: homeHref },
            { name: "Book a free inspection" },
          ]}
        />

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <PillLabel>Free inspections, written prices</PillLabel>
            <h1 className="home-display mt-5 text-[clamp(2.6rem,5.4vw,4.5rem)] text-fg">
              Book a free inspection.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-muted sm:text-[18px]">
              Cracks, sagging floors, a damp crawl space or siding. Four
              questions, and we call within one business day to find a time
              that suits you — no charge, no obligation.
            </p>
            <div className="mt-12">
              <InspectionForm
                problems={problems.map(({ id, label }) => ({ id, label }))}
                initialProblem={initial}
                business={company}
                toolHref={tool.href}
                demo={illustrative}
              />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[32px] bg-card p-2 sm:p-2.5 lg:sticky lg:top-28">
              <div className="rounded-[24px] bg-white p-6 sm:p-7">
                <p className="text-[14px] text-muted">
                  What happens after you book
                </p>
                <ol className="mt-4 space-y-5">
                  {processSteps.slice(1).map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-[14px] font-semibold text-fg">
                        {i + 1}
                      </span>
                      <span>
                        <span className="home-title block text-[18px] text-fg">
                          {s.title}
                        </span>
                        <span className="mt-1 block text-[15px] leading-[1.55] text-muted">
                          {s.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <a
                href={company.phoneHref}
                className="sky-page mt-2 flex items-center justify-between rounded-[24px] p-6 text-white sm:mt-2.5"
              >
                <span>
                  <span className="block text-[14px] text-white/85">
                    Something changed suddenly?
                  </span>
                  <span className="font-home mt-1 block text-[26px] font-medium tracking-[-0.03em] tabular-nums">
                    {company.phoneDisplay}
                  </span>
                  <span className="mt-1 block text-[13.5px] text-white/85">
                    Urgent inspections within 24 hours
                  </span>
                </span>
                <span className="flex size-12 items-center justify-center rounded-full bg-white text-fg">
                  <Icon name="phone" className="size-5" />
                </span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
