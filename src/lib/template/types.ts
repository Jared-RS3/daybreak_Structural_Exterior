/* ==========================================================================
   Daybreak home-services template — content contract

   Every section component in components/template/ takes its words, images
   and numbers from an object of these shapes and nothing else. A new client
   site is a new content file (see lib/demo-site.ts for the foundation one), not
   a fork of the components.

   Nothing here is trade-specific. The one niche-specific piece is the
   "useful thing first" tool — a crack checker here, a pool-size or HVAC
   replacement estimator elsewhere — and the template treats it as a slot:
   `ToolConfig` holds the words around it, and the page passes the actual
   instrument in as a component.
   ========================================================================== */

import type { IconKey } from "@/components/ui/Icon";

export type Cta = { label: string; href: string };

export type ImageRef = { src: string; alt: string };

export type Business = {
  name: string;
  /** What the wordmark shows under the name — the trade, not a slogan. */
  descriptor: string;
  legal: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  address: { street: string; city: string; state: string; zip: string };
  /** Short locality for eyebrows and titles: "Fort Worth, TX". */
  locality: string;
  /** How far the business reaches, in a homeowner's words. */
  region: string;
  hours: { d: string; h: string }[];
  founded: number;
  license: string;
  geo: { lat: number; lng: number };
  social: Partial<Record<"facebook" | "instagram" | "youtube" | "google", string>>;
};

/**
 * The tool that gives the homeowner something before asking anything of them.
 * Every CTA on the site that says "Check my crack" (or "Size my pool") reads
 * its label and destination from here, so renaming the tool is one edit.
 */
export type ToolConfig = {
  name: string;
  cta: string;
  href: string;
  inputLabel: string;
  placeholder: string;
  /** One line under the input answering "what's the catch". */
  reassurance: string;
  steps: { title: string; body: string }[];
};

export type TrustItem = {
  value: string;
  label: string;
  /** Renders five stars before the value. */
  rating?: boolean;
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  blurb: string;
  image: string;
  icon: IconKey;
  priceFrom: string;
  timeline: string;
  highlights: string[];
  includes: { title: string; body: string }[];
  faqs: Faq[];
  /** Which part of the business: the specialty, or the trades around it. */
  group: "specialty" | "more";
  /** Project categories that count as examples of this service. */
  projectCategories: string[];
  /** The page's primary action: price it with the tool, or get someone out. */
  leadsWith: "tool" | "inspect";
  /** Pre-selects the booking form when `leadsWith` is "inspect". */
  problemId?: string;
};

/**
 * A project is a case study, not a photo: every one answers where, what was
 * wrong, what was done, how it turned out, and who says so.
 */
export type Project = {
  slug: string;
  title: string;
  /** Neighbourhood or city as the homeowner would say it. */
  location: string;
  /** Links the project to a service-area entry for maps and area pages. */
  areaSlug: string;
  category: string;
  material: string;
  /** One-line size for cards: "14 piers", "1,840 sq ft". */
  size: string;
  /** Trade-specific figures for the spec sheet — piers for a foundation,
      humidity for a crawl space, wall area for siding. */
  specs: { label: string; value: string }[];
  days: number;
  insurance: boolean;
  image: ImageRef;
  /** Only set when the client supplies a genuinely matched pair. */
  beforeAfter?: {
    before: ImageRef & { label: string };
    after: ImageRef & { label: string };
    /** Shown on the slider while the pair is a stand-in. */
    placeholderNote?: string;
  };
  problem: string;
  solution: string;
  result: string;
  reviewId?: string;
};

export type Review = {
  id: string;
  /** A few words pulled from the quote, set large where there's room. */
  headline: string;
  quote: string;
  name: string;
  city: string;
  service: string;
  rating: number;
  source: string;
  /** Who they are, in two words: "Homeowner", "Property manager". */
  role?: string;
  /** When the review was left, as displayed: "14 Feb 2026". */
  date?: string;
  photo?: ImageRef;
  /** Dollar figures the reviewer quoted, for the proof rail's comparison card.
      First is the estimate, second what was actually signed. */
  figures?: { label: string; value: number }[];
};

export type RatingSummary = {
  score: string;
  count: number;
  source: string;
};

export type ProofItem =
  | { kind: "project"; slug: string }
  | { kind: "review"; id: string }
  | { kind: "figures"; reviewId: string };

export type Problem = {
  id: string;
  label: string;
  image: ImageRef;
  heading: string;
  causes: { title: string; body: string }[];
  firstStep: string;
  expectation: string;
  primary: Cta;
  secondary?: Cta;
};

export type Comparison = {
  /** `wait: true` steps are drawn as hatched dead time, not as actions. */
  usual: { label: string; steps: { label: string; wait?: boolean }[] };
  ours: { label: string; steps: string[]; fastSteps: number; fastLabel: string; note: string };
};

export type ProcessStep = { title: string; body: string; detail: string };

export type Area = {
  slug: string;
  city: string;
  county: string;
  lat: number;
  lng: number;
  /** Gets its own page. Only areas with something specific to say do. */
  page: boolean;
  /** The local detail that makes an area page more than a find-and-replace. */
  note?: string;
  leadTime: string;
};

export type Guarantee = { title: string; body: string; icon?: IconKey };

export type Faq = { q: string; a: string };

/** Per-client brand override for the semantic colour tokens in globals.css. */
export type SiteTheme = Partial<
  Record<
    | "--color-accent"
    | "--color-accent-strong"
    | "--color-accent-soft"
    | "--color-signal"
    | "--color-surface"
    | "--color-surface-2",
    string
  >
>;
