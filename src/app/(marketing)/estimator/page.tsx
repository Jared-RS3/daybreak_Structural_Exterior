import { AxLabel } from "@/components/daybreak/ax";
import { RepairEstimator } from "@/components/tools/RepairEstimator";
import { categories } from "@/lib/estimator";
import { openGraphDefaults } from "@/lib/seo";
import type { Metadata } from "next";

const description =
  "Tap the part of the house that worries you, or tick your symptoms, pick a size, and see a ballpark repair estimate. The live tool Daybreak builds into foundation, crawl space and siding websites.";

export const metadata: Metadata = {
  title: "House repair estimator",
  description,
  alternates: { canonical: "/estimator" },
  openGraph: {
    ...openGraphDefaults,
    url: "/estimator",
    title: "House repair estimator | Daybreak Structure-Works",
    description,
  },
};

/**
 * The house estimator on a page of its own, so it can be shared as a link.
 * Same tool as the corner launcher (which stays hidden here). `?focus=siding`
 * (any estimator section id) opens that section first, like the trade pages.
 */
export default async function EstimatorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { focus } = await searchParams;
  const section =
    typeof focus === "string" && categories.some((c) => c.id === focus)
      ? focus
      : undefined;

  return (
    <div className="bg-fg pb-20 pt-16 text-white md:pb-28 md:pt-24">
      <div className="container-wide">
        <div className="border-t border-white/20 pt-6">
          <AxLabel tone="light">Live tool · try it now</AxLabel>
        </div>
        <h1 className="font-home mt-10 text-[clamp(2.2rem,4.2vw,3.6rem)] font-normal leading-[1.06] tracking-[-0.03em] lg:mt-14">
          What would the repair cost?
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-[1.6] text-white/70">
          Point at the problem or tick your symptoms, pick a size, and see a
          ballpark once you&rsquo;ve left your details. The estimate arrives
          as a PDF by email.
        </p>
        <div className="mt-10 lg:mt-12">
          <RepairEstimator
            focus={section}
            cta={{ href: "/#free-design", label: "Get this on your site" }}
          />
        </div>
      </div>
    </div>
  );
}
