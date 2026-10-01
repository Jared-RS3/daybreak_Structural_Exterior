import { agency } from "./agency";

/**
 * The facts every search and share surface is built from: the canonical
 * origin, the name, and the default title and description. Metadata, the
 * sitemap, robots.txt, the share image and the structured data all read from
 * here, so the domain and the pitch are changed in one place.
 *
 * TODO(daybreak): confirm the production domain. The default is the domain
 * the contact email uses, which already points at Netlify. Set
 * NEXT_PUBLIC_SITE_URL in the host's environment to override it (no trailing
 * slash), e.g. for a staging deploy.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://daybreaktechinnovations.com"
).replace(/\/$/, "");

export const site = {
  name: agency.name,
  /** The homepage's <title>. Leads with what a contractor searches for. */
  title: `Foundation, Crawl Space & Siding Websites | ${agency.name}`,
  /** Kept under ~160 characters so Google shows it whole. */
  description:
    "Custom websites for foundation repair, crawl space and siding contractors that turn a homeowner's search into a booked inspection. See a free homepage concept.",
  locale: "en_US",
  /** The trades the site is written for, in the words people search with. */
  keywords: [
    "foundation repair website design",
    "foundation repair marketing",
    "crawl space repair website",
    "crawl space encapsulation marketing",
    "siding contractor website",
    "contractor web design",
    "lead generation for foundation repair companies",
    "basement waterproofing website",
  ],
} as const;

/** An absolute URL on this site, for places that can't resolve a relative one. */
export const absoluteUrl = (path = "/") => new URL(path, `${siteUrl}/`).toString();

/**
 * The link preview (1200×630). Set explicitly rather than as an
 * app/opengraph-image file: a page that sets any `openGraph` field replaces
 * the inherited one wholesale, image included, so every page spreads
 * `openGraphDefaults` and the image can't silently drop off. Its source is
 * app/_og/share-image.tsx.
 */
export const shareImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Daybreak Structure-Works: websites that book foundation, crawl space and siding jobs",
};

/** The Open Graph fields every page shares. Spread it, then add url/title. */
export const openGraphDefaults = {
  type: "website" as const,
  siteName: site.name,
  locale: site.locale,
  images: [shareImage],
};
