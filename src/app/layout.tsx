import type { Metadata, Viewport } from "next";
import { Barlow_Semi_Condensed, Inter, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { homeFont, monoFont } from "@/lib/fonts";

/* Three type roles, one per job. The brand spec calls for Founders Grotesk (or
   Söhne Breit) on headlines, Söhne for body, and DIN for anything numeric.
   All three are commercial licences that cannot be served from a CDN, so each
   role is filled by the closest open-licence face until the real files land —
   see the type note at the top of globals.css for the swap procedure. */

// Headlines — stands in for Founders Grotesk. A neo-grotesque with the same
// slightly warm, squared-off bowls, and a 400–900 variable weight axis so the
// display sizes can go genuinely heavy.
const display = Schibsted_Grotesk({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

// Body — stands in for Söhne. Both descend from Akzidenz-Grotesk, so the text
// colour on the page is close to right at reading sizes.
const body = Inter({
  variable: "--font-body-face",
  subsets: ["latin"],
  display: "swap",
});

// Numbers, stats and micro-labels — stands in for DIN. Barlow's semi-condensed
// cut shares DIN's signage lineage: narrow, low contrast, flat-sided, engineered
// rather than decorative. This is the face that marks anything measured —
// square footage, pitch, response times, pipeline, stage indices.
const numeric = Barlow_Semi_Condensed({
  variable: "--font-numeric-face",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#04090f",
  width: "device-width",
  initialScale: 1,
};

// Only the pieces every route shares. Header, footer and <main> belong to the
// route groups, because the agency site and the contractor demo it hosts are two
// different products with two different navigations.
export const metadata: Metadata = {
  metadataBase: new URL("https://daybreak.example.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Next 16 no longer overrides scroll-behavior during navigation. Without
      // this the `scroll-behavior: smooth` in globals.css (there for the anchor
      // nav) makes every route change smooth-scroll the page instead of jumping.
      data-scroll-behavior="smooth"
      // Every face variable lives on <html>: the theme tokens that reference
      // them (--font-home, --font-mono) are declared on :root, and a custom
      // property can only resolve variables visible where it's declared.
      className={`${display.variable} ${body.variable} ${numeric.variable} ${homeFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
