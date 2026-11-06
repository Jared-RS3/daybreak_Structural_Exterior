import { RepairEstimator } from "@/components/tools/RepairEstimator";
import { demoSlugs, getDemoContractor } from "@/lib/contractors/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;
export function generateStaticParams() { return demoSlugs.map((slug) => ({ slug })); }

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const config = getDemoContractor((await params).slug);
  if (!config) return { robots: { index: false, follow: false } };
  return {
    title: `${config.brand.text} estimator concept | Daybreak StructureWorks`,
    description: `An independent, interactive concept demo prepared for ${config.company} by Daybreak StructureWorks.`,
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function ContractorDemoPage({ params }: Props) {
  const config = getDemoContractor((await params).slug);
  if (!config || config.mode !== "demo") notFound();
  return <div className="bg-[#071721] pb-20 pt-20 text-white md:pb-28 md:pt-28">
    <div className="container-wide">
      <p className="inline-block border border-white/30 px-3 py-2 text-xs font-semibold tracking-wide">Unofficial concept demo for {config.brand.text} — prepared by Daybreak StructureWorks.</p>
      <div className="mt-10 grid items-end gap-8 border-t border-white/20 pt-8 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-[#82A6FF]">{config.brand.text} · estimator concept</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[1.06] tracking-[-0.045em]">What’s happening beneath your home?</h1>
        </div>
        <p className="max-w-md text-base leading-relaxed text-white/80">Select the issue you’re experiencing and explore an illustrative planning range or learn when an inspection is needed. Tailored to basement, foundation, crawl space and concrete concerns across Southeast Michigan.</p>
      </div>
      <div className="mt-8 border-l-2 border-[#82A6FF] bg-white/10 p-4 text-sm leading-relaxed text-white/85">
        HomeSpec offers free inspections and estimates. This independent Daybreak concept is not an official HomeSpec tool. It does not send leads, book appointments, or use HomeSpec pricing.
      </div>
      <div className="mt-9 lg:mt-12"><RepairEstimator config={config} /></div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/70">Service-area examples include Ann Arbor, Westland, Metro Detroit and Ypsilanti. Coverage for any specific ZIP requires confirmation. {config.pricing.disclaimer}</p>
    </div>
  </div>;
}
