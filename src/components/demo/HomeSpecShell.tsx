import { Figtree } from "next/font/google";
import NextImage from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { homespec } from "@/lib/demos/homespec";

/* ==========================================================================
   HomeSpec's look, shared by the demo page and its privacy notice.

   Taken from basementfix.com (2026-11-07): white header with the logo, the
   black "Yes, we serve" tab and the blue phone number; interior pages open on
   a dark title band over a blue stripe; heavy condensed headings with a short
   blue bar under them; black pill buttons; a grey footer. Body type is Arial,
   as theirs is. Their headings are Proxima Nova Condensed, a commercial face
   that can't be served from here, so Figtree (its closest open cousin) stands
   in. A slim ribbon at the top, and the footer, say whose page this really is.
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

export const head = "font-(family-name:--font-hs-head) font-extrabold tracking-[-0.01em]";
export const container = "mx-auto w-full max-w-[1250px] px-4 sm:px-6";
export const pillBlack =
  "inline-flex items-center justify-center gap-2 rounded-full bg-black font-bold text-white transition-colors hover:bg-[#333] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--hs-blue)";

const estimateHref = "/demo/homespec#estimate";

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

/** The page frame: ribbon, header, title band, then `children` as <main>, then the footer. */
export function HomeSpecShell({ title, children }: { title: string; children: React.ReactNode }) {
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
                  <a key={label} href={estimateHref} className="hover:text-(--hs-blue)">
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
          <h1 className="text-[24px] uppercase leading-tight text-white md:text-[34px]">{title}</h1>
        </div>
      </div>
      <div className="h-3 bg-(--hs-blue)" />

      <main id="main" className="flex-1">
        {children}
      </main>

      {/* ---- Footer, after theirs ---- */}
      <footer className="bg-[#E5E5E5]">
        <div className={`${container} flex flex-col items-center gap-3 py-10 text-center`}>
          <a href={estimateHref} className={`${pillBlack} h-13 px-8 text-[16px]`}>
            Get Your Free Estimate
          </a>
          <p className="mt-2 text-[16px]">Or call us at</p>
          <p className={`${head} text-[32px] leading-none text-(--hs-blue) md:text-[36px]`}>{homespec.phone}</p>
          <p className="text-[15px] text-[#333]">Proudly serving {homespec.areaLine}</p>
        </div>
        <div className="border-t border-black/10 px-4 py-4 text-center text-[12.5px] leading-relaxed text-[#555]">
          <p>
            Concept preview prepared for {homespec.name} by Daybreak StructureWorks, which runs this page. Not an official
            HomeSpec page: HomeSpec does not receive what you enter here, and prices are samples.
          </p>
          <p className="mt-2 flex justify-center gap-4 font-bold text-[#333]">
            <a href="/demo/homespec/privacy" className="underline underline-offset-4 hover:text-(--hs-blue)">
              Privacy Notice
            </a>
            <a href="/terms" className="underline underline-offset-4 hover:text-(--hs-blue)">
              Terms of Use
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
