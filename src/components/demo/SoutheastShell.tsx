import { Heebo } from "next/font/google";
import NextImage from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { southeast } from "@/lib/demos/southeast";

/* ==========================================================================
   Southeast Crawlspace Consulting's look, shared by the demo page and its
   privacy notice.

   Taken from southeastcrawlspaceconsulting.com (2026-11-07): a thin dark
   tagline bar ("Protect Your Home From Below"), a black bar with the Tucker
   address, a white header with the logo, "Call us now!" and the blue phone
   number over a blue "Request an assessment" button, a black uppercase nav
   bar; blue uppercase section labels over Heebo headings; white cards on
   light grey; square, uppercase buttons; a blue gradient contact band; a
   dark footer over a crawl space photo with a blue copyright strip. Heebo is
   their own face, loaded here from Google Fonts via next/font.

   A slim ribbon at the very top, and the footer, say whose page this really
   is.
   ========================================================================== */

const heebo = Heebo({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-se-head", display: "swap" });

const theme = {
  "--se-blue": "#2B6CA4", // their brand blue: buttons, labels, phone (5.5:1 with white)
  "--se-blue-ink": "#2B6CA4",
  "--se-navy": "#1D4C76", // the deep end of their contact band's gradient; links
  "--se-ink": "#111111",
  "--se-muted": "#555A60",
  "--se-line": "#DDDDDD",
  "--se-gray": "#EBEBEB", // their "What we offer" section
} as React.CSSProperties;

export const head = "font-bold tracking-[-0.01em]";
export const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6";
/** Their buttons: square-cornered, uppercase. */
export const button =
  "inline-flex items-center justify-center gap-2 rounded-[3px] font-medium uppercase tracking-[0.03em] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--se-blue)";
/** The small blue uppercase label they put over every section heading. */
export const label = "text-[14px] font-medium uppercase tracking-[0.04em] text-(--se-blue)";

const estimateHref = "/demo/southeast#estimate";

export function SoutheastShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className={`${heebo.variable} flex min-h-full flex-1 flex-col bg-white font-(family-name:--font-se-head) text-(--se-ink)`}
      style={theme}
    >
      {/* What this is, before anything else. */}
      <p className="bg-(--se-blue) px-4 py-1.5 text-center text-[12.5px] leading-snug text-white">
        <strong>Concept preview</strong>
        <span className="hidden sm:inline"> · An instant estimator built for Southeast Crawlspace Consulting by Daybreak StructureWorks</span>
        {" · "}Sample prices
      </p>

      {/* ---- Header, after southeastcrawlspaceconsulting.com ---- */}
      <header className="relative z-30">
        <p className="bg-[#2d3135] py-2 text-center text-[14px] text-white">{southeast.tagline}</p>
        <div className="bg-black text-white">
          <div className={`${container} flex items-center justify-between py-2.5 text-[14px]`}>
            <span className="flex items-center gap-1.5">
              <Icon name="pin" className="size-4" />
              {southeast.location}
            </span>
            <span className="flex items-center gap-1.5 md:hidden">
              <Icon name="phone" className="size-4" />
              {southeast.phone}
            </span>
            <span className="hidden gap-1.5 md:flex" aria-hidden>
              <span className="flex size-8 items-center justify-center rounded-[3px] bg-(--se-blue)">
                <Icon name="facebook" className="size-4.5" />
              </span>
              <span className="flex size-8 items-center justify-center rounded-[3px] bg-(--se-blue)">
                <Icon name="building" className="size-4.5" />
              </span>
            </span>
          </div>
        </div>

        <div className="bg-white">
          <div className={`${container} flex items-center justify-between py-3 md:py-4`}>
            <NextImage
              src={southeast.logo.src}
              alt={southeast.logo.alt}
              width={southeast.logo.width}
              height={southeast.logo.height}
              priority
              className="h-[84px] w-auto md:h-[112px]"
            />
            <div className="hidden flex-col items-end md:flex">
              <p className="text-[12px] font-medium uppercase tracking-[0.02em]">Call us now!</p>
              <p className="text-[30px] font-medium leading-tight text-(--se-blue)">{southeast.phone}</p>
              <a href={estimateHref} className={`${button} mt-1.5 h-10 bg-(--se-blue) px-4 text-[15px] text-white hover:bg-(--se-navy)`}>
                Request an Assessment
              </a>
            </div>
            <span className="flex flex-col items-center text-[11px] font-medium uppercase md:hidden" aria-hidden>
              <Icon name="menu" className="size-8" />
              Menu
            </span>
          </div>
        </div>

        <nav aria-label="Southeast Crawlspace Consulting (illustration)" className="hidden bg-black md:block">
          <div className={`${container} flex gap-1 py-2 text-[15px] uppercase text-white`}>
            {southeast.nav.map((item) => (
              <span key={item} className="flex items-center gap-1 px-3 py-1.5">
                {item}
                {item === "Services" && <Icon name="chevronDown" className="size-3.5" />}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* ---- Title band: page name and breadcrumb over a crawl space photo ---- */}
      <div className="relative overflow-hidden bg-[#1f2326]">
        <Img src="/images/crawl-foam.jpg" alt="" className="opacity-35" sizes="100vw" priority />
        <div className={`${container} relative py-10 md:py-14`}>
          <h1 className="text-[28px] font-bold leading-tight text-white md:text-[42px]">{title}</h1>
          <p className="mt-2 text-[14px] text-white/85">
            Home <span className="px-1.5 text-white/50">|</span> {title}
          </p>
        </div>
      </div>

      <main id="main" className="flex-1">
        {children}
      </main>

      {/* ---- Their blue contact band ---- */}
      <section className="bg-linear-to-r from-(--se-blue) to-(--se-navy) text-white">
        <div className={`${container} flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between md:py-12`}>
          <div>
            <p className="text-[14px] font-medium uppercase tracking-[0.04em]">Contact us</p>
            <p className="mt-1 text-[30px] font-bold leading-tight md:text-[36px]">Schedule a Free Inspection</p>
            <p className="mt-1.5 text-[16px]">Or call {southeast.phone}</p>
          </div>
          <a href={estimateHref} className={`${button} h-12 bg-black px-6 text-[15px] text-white hover:bg-[#333]`}>
            Get My Instant Estimate
          </a>
        </div>
      </section>

      {/* ---- Footer, after theirs ---- */}
      <footer className="relative overflow-hidden bg-[#1a1d20] text-white">
        <Img src="/images/crawl-inspection.jpg" alt="" className="opacity-15" sizes="100vw" />
        <div className={`${container} relative grid gap-9 py-12 md:grid-cols-[1.1fr_1fr_1.2fr]`}>
          <div>
            <NextImage
              src={southeast.logo.light}
              alt={southeast.logo.alt}
              width={southeast.logo.width}
              height={southeast.logo.height}
              className="h-[96px] w-auto"
            />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/85">
              Crawl space cleanouts, encapsulation, moisture control, drainage, floor support and basement waterproofing across{" "}
              {southeast.areaLine}.
            </p>
          </div>
          <div>
            <p className="border-b border-white/40 pb-2 text-[20px] font-medium">Company Information</p>
            <ul className="mt-4 grid gap-2.5 text-[14px] text-white/90">
              <li className="flex gap-2.5">
                <Icon name="building" className="mt-0.5 size-4 shrink-0" />
                {southeast.name}
              </li>
              <li className="flex gap-2.5">
                <Icon name="pin" className="mt-0.5 size-4 shrink-0" />
                {southeast.location}
              </li>
              <li className="flex gap-2.5">
                <Icon name="phone" className="mt-0.5 size-4 shrink-0" />
                {southeast.phone}
              </li>
              <li className="flex gap-2.5">
                <Icon name="clock" className="mt-0.5 size-4 shrink-0" />
                <span>
                  {southeast.hours[0]}
                  <br />
                  {southeast.hours[1]}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <p className="border-b border-white/40 pb-2 text-[20px] font-medium">Services</p>
            <ul className="mt-4 grid gap-x-4 gap-y-2 text-[14px] text-white/90 sm:grid-cols-2">
              {southeast.services.map((s) => (
                <li key={s} className="flex gap-1.5">
                  <Icon name="chevronRight" className="mt-1 size-3 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative bg-(--se-blue) px-4 py-3 text-center text-[13px] leading-relaxed">
          <p>
            Concept preview prepared for {southeast.name} by Daybreak StructureWorks, which runs this page. Not an official
            Southeast Crawlspace Consulting page: they do not receive what you enter here, and prices are samples.
          </p>
          <p className="mt-1.5 flex justify-center gap-4 font-medium">
            <a href="/demo/southeast/privacy" className="underline underline-offset-4 hover:text-white/80">
              Privacy Notice
            </a>
            <a href="/terms" className="underline underline-offset-4 hover:text-white/80">
              Terms of Use
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
