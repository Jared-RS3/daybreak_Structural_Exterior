import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import NextImage from "next/image";
import { HomeSpecEstimator } from "@/components/demo/HomeSpecEstimator";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { homespec } from "@/lib/demos/homespec";

/* ==========================================================================
   /demo/homespec: a concept page for HomeSpec Waterproofing & Foundation
   Repair, showing Daybreak's estimator as it would sit on basementfix.com.

   It lives outside the (marketing) group on purpose: no Daybreak header,
   footer or tool launcher, just HomeSpec's own look. Taken from their site
   (2026-11-07): white header with the logo, the black "Yes, we serve" tab and
   the blue phone number; interior pages open on a dark title band over a
   blue stripe; heavy condensed headings with a short blue bar under them;
   black pill buttons; grey trust tiles and a grey footer. Body type is Arial,
   as theirs is. Their headings are Proxima Nova Condensed, a commercial
   face that can't be served from here, so Figtree (its closest open cousin)
   stands in.

   A slim ribbon at the top says what this is. The page is noindex and absent
   from the sitemap. Its lead form works like the live tool's: /api/tool-lead
   saves the row to Airtable and emails the homeowner a HomeSpec PDF.
   ========================================================================== */

const headFace = Figtree({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-hs-head", display: "swap" });

const theme = {
  "--hs-blue": "#2A7AF3", // their accent: bars, stripes, rules
  "--hs-blue-ink": "#1F70E9", // the same blue, a shade deeper where white text sits on it (4.6:1)
  "--hs-navy": "#005BAA", // their link and FAQ blue
  "--hs-ink": "#222222",
  "--hs-muted": "#55595F",
  "--hs-line": "#E3E5E8",
  "--hs-gray": "#F6F6F6",
} as React.CSSProperties;

export const metadata: Metadata = {
  title: { absolute: "Instant Repair Estimate | HomeSpec concept by Daybreak StructureWorks" },
  description:
    "A concept preview of an instant repair estimator for HomeSpec Waterproofing & Foundation Repair, prepared by Daybreak StructureWorks.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const head = "font-(family-name:--font-hs-head) font-extrabold tracking-[-0.01em]";
const container = "mx-auto w-full max-w-[1250px] px-4 sm:px-6";
const pillBlack =
  "inline-flex items-center justify-center gap-2 rounded-full bg-black font-bold text-white transition-colors hover:bg-[#333] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--hs-blue)";

function Logo({ className }: { className?: string }) {
  return (
    <NextImage
      src={homespec.logo.src}
      alt={homespec.logo.alt}
      width={homespec.logo.width}
      height={homespec.logo.height}
      priority
      className={className}
    />
  );
}

export default function HomeSpecDemoPage() {
  return (
    <div
      className={`${headFace.variable} flex min-h-full flex-1 flex-col bg-white font-[Arial,Helvetica,sans-serif] text-(--hs-ink)`}
      style={theme}
    >
      {/* What this is, before anything else. */}
      <p className="bg-[#111] px-4 py-2 text-center text-[12.5px] leading-snug text-white/85">
        <strong className="text-white">Concept preview</strong>
        <span className="hidden sm:inline"> · An instant estimator built for HomeSpec by Daybreak StructureWorks</span>
        {" · "}Sample prices
      </p>

      {/* ---- Header, after basementfix.com ---- */}
      <header className="relative z-30 bg-white shadow-[0_2px_10px_rgb(0_0_0/0.08)]">
        {/* Phones: their black strip with "Call Now", then the logo and menu. */}
        <div className="flex items-stretch bg-black text-white md:hidden">
          <p className="flex flex-1 items-center justify-center py-2 text-center text-[13px] leading-tight">
            Yes, we serve <strong className="ml-1">{homespec.serving}</strong>
          </p>
          <span className="flex items-center gap-1.5 bg-(--hs-blue-ink) px-4 text-[14px] font-bold">
            <Icon name="phone" className="size-4" />
            Call Now
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 md:hidden">
          <Logo className="h-[58px] w-auto" />
          <span className="flex flex-col items-center text-[11px] font-bold uppercase text-(--hs-navy)" aria-hidden>
            <Icon name="menu" className="size-8 text-black" />
            Menu
          </span>
        </div>

        {/* Wider: logo left; the tab, phone and navigation stacked right. */}
        <div className={`${container} hidden items-center justify-between md:flex`}>
          <Logo className="my-5 h-[88px] w-auto lg:h-[100px]" />
          <div className="flex flex-col items-end self-stretch">
            <p className="rounded-bl-[22px] bg-black py-1.5 pl-5 pr-6 text-[15px] text-white">
              Yes, we serve <strong>{homespec.serving}</strong>
            </p>
            <p className={`${head} mt-2 text-[34px] leading-none text-(--hs-blue) lg:text-[38px]`}>{homespec.phone}</p>
            <nav aria-label="HomeSpec (illustration)" className="mb-4 mt-auto flex gap-6 pt-5 text-[17px] font-bold text-[#333] lg:gap-9">
              {homespec.nav.map((label, i) =>
                label === "Free Estimate" ? (
                  <a key={label} href="#estimate" className="hover:text-(--hs-blue)">
                    {label}
                  </a>
                ) : (
                  <span key={label} className="flex items-center gap-1.5">
                    {label}
                    {i < 3 && <Icon name="chevronDown" className="size-4" />}
                  </span>
                ),
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ---- Title band and blue stripe, as on their interior pages ---- */}
      <div className="relative overflow-hidden bg-[#3b3e43]">
        <Img src="/images/foundation-crack-block.jpg" alt="" className="opacity-30 grayscale" sizes="100vw" priority />
        <div className={`${container} relative py-8 md:py-12`}>
          <h1 className="text-[24px] uppercase leading-tight text-white md:text-[34px]">Instant Repair Estimate</h1>
        </div>
      </div>
      <div className="h-3 bg-(--hs-blue)" />

      <main id="main" className="flex-1">
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
      </main>

      {/* ---- Footer, after theirs ---- */}
      <footer className="bg-[#E5E5E5]">
        <div className={`${container} flex flex-col items-center gap-3 py-10 text-center`}>
          <a href="#estimate" className={`${pillBlack} h-13 px-8 text-[16px]`}>
            Get Your Free Estimate
          </a>
          <p className="mt-2 text-[16px]">Or call us at</p>
          <p className={`${head} text-[32px] leading-none text-(--hs-blue) md:text-[36px]`}>{homespec.phone}</p>
          <p className="text-[15px] text-[#333]">Proudly serving {homespec.areaLine}</p>
        </div>
        <p className="border-t border-black/10 px-4 py-4 text-center text-[12.5px] leading-relaxed text-[#555]">
          Concept preview prepared for {homespec.name} by Daybreak StructureWorks. Not an official HomeSpec page; prices are
          samples.
        </p>
      </footer>
    </div>
  );
}
