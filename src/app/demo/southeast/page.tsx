import type { Metadata } from "next";
import { SoutheastEstimator } from "@/components/demo/SoutheastEstimator";
import { SoutheastShell, button, container, head, label } from "@/components/demo/SoutheastShell";
import { Icon } from "@/components/ui/Icon";
import { southeast } from "@/lib/demos/southeast";

/* ==========================================================================
   /demo/southeast: a concept page for Southeast Crawlspace Consulting,
   showing Daybreak's estimator as it would sit on their site. On this
   branch it is the site's front door (next.config.ts redirects).

   Outside the (marketing) group on purpose: no Daybreak header, footer or
   tool launcher, just SECC's look (components/demo/SoutheastShell.tsx). The
   page is noindex and absent from the sitemap. Its lead form works like the
   live tool's: /api/tool-lead saves the row to Airtable and emails the
   homeowner an SECC-branded PDF. What happens to that data is set out at
   /demo/southeast/privacy.
   ========================================================================== */

export const metadata: Metadata = {
  title: { absolute: "Instant Repair Estimate | Southeast Crawlspace Consulting concept by Daybreak StructureWorks" },
  description:
    "A concept preview of an instant crawl space repair estimator for Southeast Crawlspace Consulting, prepared by Daybreak StructureWorks.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function SoutheastDemoPage() {
  return (
    <SoutheastShell title="Instant Repair Estimate">
      {/* ---- The pitch, in a sentence ---- */}
      <section className={`${container} grid gap-8 py-10 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-12 md:py-14`}>
        <div>
          <p className={label}>Instant estimate</p>
          <h2 className={`${head} mt-1.5 text-[30px] leading-[1.12] md:text-[42px]`}>
            See What It Takes to Protect Your Home From Below
          </h2>
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-[#333]">
            Point at the problem, or check off what you’re noticing, and pick a size. No tape measure and no sales visit: see a
            ballpark price in about a minute, then book your free crawlspace inspection for the exact number.
          </p>
          <a href="#estimate" className={`${button} mt-6 h-11 bg-black px-5 text-[15px] text-white hover:bg-[#333]`}>
            Start My Estimate
          </a>
        </div>
        <ul className="grid gap-3">
          {southeast.promises.map((p) => (
            <li key={p.title} className="flex gap-3.5 rounded-[3px] bg-white p-4 shadow-[0_1px_8px_rgb(0_0_0/0.1)]">
              <Icon name={p.icon} className="mt-0.5 size-7 shrink-0 text-(--se-blue)" />
              <span>
                <span className="block text-[17px] font-medium uppercase leading-snug text-(--se-blue)">{p.title}</span>
                <span className="mt-1 block text-[14.5px] leading-snug text-[#333]">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- The estimator, on their grey "What we offer" ground ---- */}
      <section id="estimate" aria-label="Instant repair estimate" className="scroll-mt-4 bg-(--se-gray) py-12 md:py-16">
        <div className={container}>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className={label}>What’s going on below?</p>
            <h2 className={`${head} mt-1.5 text-[28px] leading-tight md:text-[38px]`}>Find the Problem, See a Ballpark Price</h2>
          </div>
          <SoutheastEstimator />
          <p className="mt-4 text-[13px] leading-relaxed text-(--se-muted)">
            A ballpark only. Prices on this page are sample figures for the demo, not Southeast Crawlspace Consulting’s; the live
            version uses yours. Your exact price comes from a free crawlspace inspection.
          </p>
        </div>
      </section>
    </SoutheastShell>
  );
}
