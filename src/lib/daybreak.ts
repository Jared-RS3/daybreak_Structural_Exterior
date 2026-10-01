/* ==========================================================================
   Daybreak — content for the agency homepage (/)

   Daybreak is a web agency. This site sells websites to three trades:
   foundation repair, crawl space repair and siding. It is not a contractor. Everything on this page is about the
   websites and the systems behind them.

   Same rule as lib/agency.ts: nothing here asserts a result Daybreak has not
   produced, and nothing is attributed to someone who did not say it. There
   are no client logos, testimonials or percentages because there are no
   published client results yet. The proof on this page is the concept work
   and the crack checker a visitor can try for themselves.
   ========================================================================== */

import type { IconKey } from "@/components/ui/Icon";
import { agency } from "./agency";
import type {
  Comparison,
  Faq,
  Guarantee,
  ProcessStep,
  Review,
} from "./template/types";

/**
 * Cal.com booking for the hero's consultation button.
 *
 * TODO(daybreak): set `calUsername` to your Cal.com username (the part after
 * cal.com/). Set `calEvent` too if you want a specific meeting type, e.g.
 * "30min" for cal.com/yourname/30min. While the username is empty the button
 * falls back to the audit form on this page, so it never links to someone
 * else's calendar or a Cal.com 404.
 */
export const booking = {
  calUsername: "daybreak-tech-innovations-trw1px",
  calEvent: "Discovery-Call",
};

export const bookingHref =
  "https://cal.com/daybreak-tech-innovations-trw1px/discovery-call";

export const daybreak = {
  name: agency.name,
  wordmark: agency.name,
  descriptor: "",
  email: agency.email,
  /** The free concept is shown on the first call, so asking for it books one.
      (The on-page form it used to scroll to, #free-design, is switched off.) */
  offerHref: bookingHref,
};

/**
 * The short film above "How it works". Read by the page, the video sitemap and
 * the VideoObject structured data, so they always describe the same file.
 */
export const automationFilm = {
  title: "Does your business run without you? Why automation matters",
  description:
    "Thirty seconds on why the contractors who grow are the ones whose leads get answered, booked and followed up without them lifting a finger.",
  src: "/videos/why-automation.mp4",
  poster: "/videos/why-automation-poster.jpg",
  seconds: 28,
  uploaded: "2026-10-01",
};

/**
 * The About block. The statement is written in Daybreak's own voice; the
 * figures are commitments and facts that are true today — not a track record.
 * When there are real results (sites launched, jobs booked), they go here,
 * with the source and the date.
 */
export const about = {
  statement:
    "We're Jared and Yaaseen. We build websites for foundation repair, crawl space and siding contractors, and we judge our work by how many inspections it books.",
  stats: [
    { value: "2", label: "Founders on every project" },
    { value: "100%", label: "Of our clients are still with us" },
    { value: "3", label: "Trades we specialise in" },
    { value: "100%", label: "You own your site and data" },
  ],
};

/**
 * The founders' statement for the "From the founders" band. Daybreak's own
 * words on its own site — TODO(daybreak): Jared and Yaaseen to approve or
 * rewrite before launch.
 */
export const founderNote =
  "Our names go on every site we build. You work with the two of us from your first design to launch day, and every month we show you exactly what your site brought in.";

/**
 * The free offer: on the first call we show the contractor a concept of their
 * homepage, so they see their own company on a better site before they pay
 * anything. It is a first look at the direction, not the finished design: the
 * final design starts once they've agreed a price and paid the deposit, and
 * the concept stays Daybreak's work until then (terms page, "Intellectual
 * property"). It replaces the old free audit.
 *
 * TODO(daybreak): Jared and Yaaseen to confirm `reply` — it's a promise the
 * form makes the moment someone submits.
 */
export const offer = {
  label: "Free contractor homepage concept",
  cta: "Get my free website concept",
  includes: [
    "A concept of your homepage",
    "Your service area & towns",
    "Your repairs & services",
    "Notes on your current site",
  ],
  reply: "within one business day",
};

/**
 * The promise. Each line is a commitment to keep. The free part is the
 * concept and the call; refining it into the final design is paid work, so
 * the page never promises free revisions.
 */
export const promise: { title: string; lede: string; items: Guarantee[] } = {
  title: "See your new homepage before you pay a cent.",
  lede: "On your first call we show you a concept of your homepage, with your logo, services and towns. It's free, and you owe nothing if it's not for you. It's a first look at the direction, not the finished design: if you like it, you get a fixed price in writing, and the final design starts once you've signed off and paid the deposit.",
  items: [
    {
      title: "Our names on every site",
      icon: "users",
      body: "You work with the two founders from your first design to launch day. No account managers, no hand-offs.",
    },
    {
      title: "You own everything",
      icon: "shield",
      body: "Your site, domain and data are in your name. If you ever leave, you take it all with you.",
    },
    {
      title: "Reported every month",
      icon: "document",
      body: "Every month we show you the calls, forms and jobs your site brought in, including the months it isn't working yet.",
    },
  ],
};

/** Ticked under the hero buttons (the first button is the free design). Each one is true today. */
export const heroPromises = [
  "Free homepage concept on your first call",
  "Built to book more inspections",
];

/**
 * The trust row under the hero. The hero itself carries the one track record
 * claim on the page: every client Daybreak has built for is still a client.
 * It is true across all past work (none of it in these three trades), which is why the
 * "Past clients" item here says where it comes from. If a client ever leaves,
 * change the hero line; don't soften it. Nothing here repeats `heroPromises`.
 */
export const heroTrust = [
  { value: "Custom", label: "contractor sites" },
  { value: "Foundation", label: "crawl space & siding specialists" },
  { value: "Free concept", label: "before any commitment" },
  { value: "You own it", label: "site, domain & data" },
];

/**
 * The three trades Daybreak builds for. They share a buyer (a homeowner who
 * has just noticed something wrong with the house) and a sale (a free
 * inspection that turns into a written price), so one kind of site serves all
 * three. `features` are what the site does for that trade — "live" means it
 * is built and running in the reference build today, "next" means it is
 * designed but not shipped. Never mark something live that a visitor can't
 * use.
 */
export type Trade = {
  name: string;
  line: string;
  image: string;
  features: { label: string; status: "live" | "next" }[];
  specialty?: boolean;
};

export const trades: Trade[] = [
  {
    name: "Foundation repair",
    line: "Piers, slab and pier-and-beam repair, bowing walls and drainage.",
    image: "/images/foundation-excavation.jpg",
    specialty: true,
    features: [
      { label: "Crack & symptom checker", status: "live" },
      { label: "Inspection booking by symptom", status: "live" },
      { label: "Pages for every repair method", status: "live" },
    ],
  },
  {
    name: "Crawl space repair",
    line: "Encapsulation, vapor barriers, dehumidifiers and sagging floors.",
    image: "/images/crawl-inspection.jpg",
    specialty: true,
    features: [
      { label: "Musty-smell & moisture question paths", status: "live" },
      { label: "Before & after encapsulation case studies", status: "live" },
      { label: "Sagging-floor answers in the crack checker", status: "live" },
    ],
  },
  {
    name: "Siding & exterior",
    line: "Fiber cement, vinyl and engineered wood, plus trim, soffit and fascia.",
    image: "/images/siding-crew.jpg",
    specialty: true,
    features: [
      { label: "Service pages by material", status: "live" },
      { label: "Project pages with before & after", status: "live" },
      { label: "Quote requests by siding problem", status: "live" },
    ],
  },
];

/**
 * Starting points for the value calculator's trade picker. They are only
 * defaults the visitor drags away from: the calculator does plain arithmetic
 * on whatever they set and never adds an uplift of its own.
 */
export type CalculatorTrade = { name: string; jobs: string; jobValue: number };

export const calculatorTrades: CalculatorTrade[] = [
  { name: "Foundation repair", jobs: "foundation jobs", jobValue: 9500 },
  { name: "Crawl space", jobs: "crawl space jobs", jobValue: 8000 },
  { name: "Siding", jobs: "siding jobs", jobValue: 18000 },
];

/** The system, simplified to the six steps a contractor recognises. */
export type SystemStep = {
  title: string;
  body: string;
  icon: IconKey;
  /** The worked example: when this step happens for one homeowner… */
  when: string;
  /** …and what it looks like from her side, in one line. */
  story: string;
};

/**
 * The system, simplified to the six steps a contractor recognises. `when` and
 * `story` follow one fictional homeowner (Sarah, in Keller) through it; the
 * section labels her as a worked example.
 */
export const system: SystemStep[] = [
  {
    title: "Get found",
    when: "0:00",
    story:
      "Sarah spots a crack in her brick and searches “foundation repair Keller”. You're the first result.",
    icon: "pin",
    body: "Show up on Google in the towns you work in.",
  },
  {
    title: "Give value",
    when: "0:40",
    story: "On your site she checks the crack. It says: worth an inspection.",
    icon: "search",
    body: "Give homeowners an answer before they call.",
  },
  {
    title: "Capture",
    when: "1:10",
    story: "She books an inspection. You get the lead instantly.",
    icon: "target",
    body: "Every call and form comes straight to you.",
  },
  {
    title: "Respond",
    when: "1:13",
    story: "Seconds later she gets a text back from you.",
    icon: "bolt",
    body: "The homeowner gets a text back in seconds.",
  },
  {
    title: "Follow up",
    when: "Days 1–6",
    story: "You send the pier estimate. Reminders go out until she replies.",
    icon: "loop",
    body: "Automatic reminders until they reply.",
  },
  {
    title: "Track revenue",
    when: "Day 12",
    story: "She signs. You can see it all started with that Google search.",
    icon: "calculator",
    body: "See which marketing brought in each job.",
  },
];

export const comparison: Comparison = {
  usual: {
    label: "A typical contractor website",
    steps: [
      { label: "Homeowner fills in a contact form" },
      { label: "It sits in a shared inbox", wait: true },
      { label: "Someone calls back between jobs" },
      { label: "By then they've booked someone else", wait: true },
      { label: "Nobody knows which ad paid for it", wait: true },
      { label: "The site looks the same next year" },
    ],
  },
  ours: {
    label: "A Daybreak site",
    steps: [
      "Homeowner checks their crack on the site",
      "Lead lands in your CRM with its source",
      "They get a text back in seconds",
      "Your rep is notified with the details",
      "Follow-up runs until they answer",
      "The signed job is traced to its channel",
    ],
    fastSteps: 3,
    fastLabel: "In the first minute",
    note: "The site does the part of the job nobody on your team has time for.",
  },
};

export const process: ProcessStep[] = [
  {
    title: "Free concept",
    body: "Book a call and tell us about your company. On the call we show you a concept of your new homepage, so you can see the direction before you spend anything.",
    detail: "Free, no obligation",
  },
  {
    title: "Final design",
    body: "Like the direction? You get a fixed price in writing. Once you sign off and pay the deposit, we turn the concept into your final design, with your feedback.",
    detail: "Starts with the deposit",
  },
  {
    title: "Build & launch",
    body: "We build the rest of your site and you approve it before it goes live. Every month after, we show you the jobs it brought in.",
    detail: "Monthly reporting",
  },
];

/** Terms and ownership, from lib/agency.ts. Every one is a commitment to keep. */
export const terms: Guarantee[] = [
  {
    title: "Month to month",
    icon: "clock",
    body: "No twelve-month lock-in. If a month goes badly you can leave at the end of it, with everything you own.",
  },
  {
    title: "The goal is agreed first",
    icon: "target",
    body: "We agree on the goal at the start and write it down, so we both know what we're aiming for.",
  },
  {
    title: "Reported monthly",
    icon: "document",
    body: "The same attribution view, on your data, every month. Including the months where it isn't working yet.",
  },
  {
    title: "Your website & domain",
    icon: "shield",
    body: "The site and the domain are registered in your name, and you can move them whenever you like.",
  },
  {
    title: "Your data & leads",
    icon: "users",
    body: "Ad accounts, analytics and CRM data stay in your name. Leads reach you first, always.",
  },
  {
    title: "Founding rate",
    icon: "badge",
    body: "Below what this will cost in a year, in exchange for permission to publish what happened, once there's something to publish.",
  },
];

/**
 * Client reviews for the homepage carousel: real ones only, in the client's
 * own words and with their permission. These are from Daybreak's website
 * clients before the move to contractors, so the section doesn't call them
 * contractors. `role` is shown under the name, `city` (with a pin) only when
 * set, and `headline` and `source` aren't shown in the carousel.
 */
const review = (
  id: string,
  name: string,
  role: string,
  quote: string,
  headline: string,
): Review => ({
  id,
  headline,
  quote,
  name,
  role,
  city: "",
  service: "Website",
  rating: 5,
  source: "Client",
});

export const reviews: Review[] = [
  review(
    "nj-tfm",
    "NJ",
    "TFM",
    "It's inspiring to see how Daybreak has brought my vision to reality.",
    "My vision to reality",
  ),
  review(
    "naughty-berry",
    "Naughty Berry",
    "Naughty Berry team",
    "Nothing short of amazing working with the Daybreak team, we wish them the best.",
    "Nothing short of amazing",
  ),
  review(
    "lumi-branding",
    "Lumi Branding",
    "Lumi Branding team",
    "You guys are amazing, super happy that you were recommended. Keep up the amazing work!",
    "Super happy",
  ),
  review(
    "natania-eon",
    "Natania",
    "EON General team",
    "We are so happy with the website, it's exactly what we wanted!",
    "Exactly what we wanted",
  ),
  review(
    "forge-lab",
    "Forge Lab Studios",
    "Website client",
    "Finally, an agency that delivers what it promises.",
    "Delivers what it promises",
  ),
];

/**
 * Reviews written for a client to approve, shown in development only. Move one
 * into `reviews` once the client has read it and said yes, in writing: a
 * review in someone's name that they didn't give is a fake review.
 *
 * TODO(daybreak): send Glynn this wording (or ask for his own) before launch.
 */
export const draftReviews: Review[] = [
  review(
    "glynn-wessels",
    "Glynn",
    "Wessels Plumbing",
    "Daybreak built our new website and it's exactly what we needed. It looks professional, customers can find us and get in touch easily, and the team was great to deal with from start to finish.",
    "Exactly what we needed",
  ),
];

/** Layout stand-ins for `reviews`, development only. Obviously not real. */
export const placeholderReviews: Review[] = [
  "Placeholder review. The client's own words go here: what their website was like before, and what changed after.",
  "Placeholder review. For example, how inspection requests from Google changed, in their words.",
  "Placeholder review. What working with the two founders was like, from the first design to launch day.",
  "Placeholder review. A short one.",
  "Placeholder review. What the monthly reporting showed them about where their jobs come from.",
  "Placeholder review. How homeowners use the crack checker or the estimate before they call.",
].map((quote, i) => ({
  id: `placeholder-${i + 1}`,
  headline: "Placeholder",
  quote,
  name: "Client Name",
  role: "Owner, Company name",
  city: "City, ST",
  service: ["Foundation repair", "Crawl space", "Siding"][i % 3],
  rating: 5,
  source: "Placeholder",
}));

export const faqs: Faq[] = [
  {
    q: "Which contractors do you build websites for?",
    a: "Foundation repair, crawl space and siding companies. Many of them also sell basement waterproofing, drainage, concrete lifting, windows or gutters, and your site covers those too.",
  },
  {
    q: "What do I get with the free homepage concept?",
    a: "On your first call we show you a concept of your homepage, with your logo, colours, services and the towns you work in. If you already have a website, we'll also tell you what's worth keeping. It's free, and you don't have to buy anything.",
  },
  {
    q: "Is the concept my finished design?",
    a: "No. It's a first look at the direction, so you can judge us on real work before you commit. If you go ahead, the final design starts once you've agreed the price and paid the deposit, and we refine it with your feedback from there. The design files and the finished site are handed over to you as part of the paid project.",
  },
  {
    q: "What does a website cost?",
    a: "It depends on the size of your business. Once you've seen your free homepage concept you get a fixed price in writing, so there are no surprises.",
  },
  {
    q: "I already have a website. Do I have to start over?",
    a: "Not always. When we design your homepage we'll tell you what's worth keeping and what needs fixing.",
  },
  {
    q: "Who owns the website?",
    a: "You do. The site, the domain and all your data are yours, and if you ever leave, you take it all with you.",
  },
  {
    q: "What is the crack checker?",
    a: "A short set of questions a homeowner answers about a crack: where it is, what it looks like, how wide it is and what else the house is doing. It tells them how serious it probably is and books the right inspection. You can try it on this page and on our sample site.",
  },
];
