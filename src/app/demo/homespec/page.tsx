import type { Metadata } from "next";
import { HomeSpecEstimator } from "@/components/demo/HomeSpecEstimator";
import { HomeSpecShell, container, head, pillBlack } from "@/components/demo/HomeSpecShell";
import { Icon } from "@/components/ui/Icon";
import { homespec } from "@/lib/demos/homespec";

/* ==========================================================================
   /demo/homespec: a concept page for HomeSpec Waterproofing & Foundation
   Repair, showing Daybreak's estimator as it would sit on basementfix.com.
   On this branch it is the site's front door (next.config.ts redirects).

   Outside the (marketing) group on purpose: no Daybreak header, footer or
   tool launcher, just HomeSpec's look (components/demo/HomeSpecShell.tsx).
   The page is noindex and absent from the sitemap. Its lead form works like
   the live tool's: /api/tool-lead saves the row to Airtable and emails the
   homeowner a HomeSpec PDF. What happens to that data is set out at
   /demo/homespec/privacy.
   ========================================================================== */

export const metadata: Metadata = {
  title: { absolute: "Instant Repair Estimate | HomeSpec concept by Daybreak StructureWorks" },
  description:
    "A concept preview of an instant repair estimator for HomeSpec Waterproofing & Foundation Repair, prepared by Daybreak StructureWorks.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function HomeSpecDemoPage() {
  return (
    <HomeSpecShell title="Instant Repair Estimate">
      {/* ---- The pitch, in a sentence ---- */}
      <section className={`${container} grid gap-8 py-10 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-14 md:py-14`}>
        <div>
          <h2 className={`${head} text-[30px] leading-[1.08] md:text-[44px]`}>
            It’s What’s <em className="not-italic text-(--hs-blue)">Under</em> Your House. Here’s What It Costs.
          </h2>
          <span aria-hidden className="mt-4 block h-1 w-24 bg-(--hs-blue)" />
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#333]">
            Point at the problem, or check off what you’re noticing, and pick a size. No tape measure, no sales visit: see a
            ballpark price in about a minute, then book your free inspection for the exact number.
          </p>
        </div>
        <ul className="grid gap-3">
          {homespec.promises.map((p) => (
            <li key={p} className="flex items-center gap-3 rounded-md bg-(--hs-gray) px-4 py-3.5 text-[17px] font-bold">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--hs-blue-ink) text-white">
                <Icon name="check" className="size-4" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* ---- The estimator ---- */}
      <section id="estimate" aria-label="Instant repair estimate" className={`${container} scroll-mt-4 pb-14 md:pb-20`}>
        <HomeSpecEstimator />
        <p className="mt-4 text-[13px] leading-relaxed text-(--hs-muted)">
          A ballpark only. Prices on this page are sample figures for the demo, not HomeSpec’s; the live version uses yours. Your
          exact price comes from a free in-home inspection.
        </p>
      </section>

      {/* ---- Their trust tiles ---- */}
      <section className="bg-(--hs-gray) py-12 md:py-16">
        <div className={`${container} grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-center lg:gap-14`}>
          <div>
            <h2 className={`${head} text-[30px] leading-[1.1] md:text-[38px]`}>Why Metro Detroit Homeowners Trust HomeSpec</h2>
            <span aria-hidden className="mt-4 block h-1 w-24 bg-(--hs-blue)" />
            <p className="mt-5 text-[16.5px] leading-relaxed text-[#333]">
              Family-owned since 1994, with permanent solutions for basement waterproofing, foundation repair, crawl space
              repair and concrete leveling across {homespec.areaLine.replaceAll(" •", ",")}.
            </p>
            <a href="#estimate" className={`${pillBlack} mt-6 h-13 px-7 text-[15.5px]`}>
              Get Your Free Estimate
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {homespec.trust.map((t) => (
              <li key={t.text} className="bg-white p-1.5 shadow-[0_1px_4px_rgb(0_0_0/0.06)]">
                <div className="flex h-full flex-col items-center justify-center gap-3 border border-[#ececec] px-3 py-6 text-center md:py-8">
                  <Icon name={t.icon} className="size-11 text-(--hs-blue) md:size-14" />
                  <p className="text-[15px] font-bold leading-snug text-[#333] md:text-[17px]">{t.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </HomeSpecShell>
  );
}
