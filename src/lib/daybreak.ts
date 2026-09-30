/* ==========================================================================
   Daybreak — content for the agency homepage (/)

   Daybreak is a web agency. This site sells websites to three trades:
   foundation repair, crawl space repair and siding. It is not a contractor. Everything on this page is about the
   websites and the systems behind them.

   Same rule as lib/agency.ts: nothing here asserts a result Daybreak has not
   produced, and nothing is attributed to someone who did not say it. There
   are no client logos, testimonials or percentages because there are no
   published client results yet. The proof on this page is work a visitor can
   open and use: the live contractor site at /work/daybreak-foundation.
   ========================================================================== */

import type { IconKey } from "@/components/ui/Icon";
import { agency } from "./agency";
import type { Comparison, Faq, Guarantee, ProcessStep } from "./template/types";

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
  descriptor: "Websites for foundation & exterior contractors",
  email: agency.email,
  offerHref: "/#free-design",
  workHref: "/work/daybreak-foundation",
  toolHref: "/work/daybreak-foundation/crack-checker",
};

/**
 * The About block. The statement is written in Daybreak's own voice; the
 * figures are commitments and facts that are true today — not a track record.
 * When there are real results (sites launched, jobs booked), they go here,
 * with the source and the date.
 */
export const about = {
  statement:
    "We're Jason and Jared. We build websites for foundation repair, crawl space and siding contractors, and we judge our work by how many inspections it books.",
  stats: [
    { value: "2", label: "Founders on every project" },
    { value: "0", label: "Account managers" },
    { value: "3", label: "Trades we specialise in" },
    { value: "100%", label: "You own your site and data" },
  ],
};

/**
 * The founders' statement for the "From the founders" band. Daybreak's own
 * words on its own site — TODO(daybreak): Jason and Jared to approve or
 * rewrite before launch.
 */
export const founderNote =
  "Our names go on every site we build. You work with the two of us from your first design to launch day, and every month we show you exactly what your site brought in.";

/**
 * The free offer: we design the contractor's homepage before they pay
 * anything, so they see their own company on a better site first. It replaces
 * the old free audit (the notes on their current site are now part of it).
 *
 * TODO(daybreak): Jason and Jared to confirm `reply` — it's a promise the
 * form makes the moment someone submits.
 */
export const offer = {
  label: "Free contractor homepage design",
  cta: "Get my free contractor homepage",
  includes: [
    "Your homepage, designed",
    "Your service area & towns",
    "Your repairs & services",
    "Notes on your current site",
  ],
  reply: "within one business day",
};

/**
 * The promise, shown just before the form. Each line is a commitment to keep.
 * TODO(daybreak): Jason and Jared to confirm the headline promise (revisions
 * until they're happy, nothing owed if they walk away) before launch.
 */
export const promise: { title: string; lede: string; items: Guarantee[] } = {
  title: "You don't pay until you love the design.",
  lede: "We'll change your homepage design as many times as it takes. If it still isn't right, you walk away and owe us nothing.",
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
  "Free homepage design before you pay",
  "Built to book more inspections",
  "Foundation, crawl space & siding only",
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
  { value: "Free design", label: "before any commitment" },
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
    title: "Free design",
    body: "Tell us about your company. We design your new homepage and change it until you're happy with it.",
    detail: "Free",
  },
  {
    title: "Build",
    body: "Like it? We build the rest of your site. You approve it before it goes live.",
    detail: "You approve it",
  },
  {
    title: "Launch & report",
    body: "Your site goes live. Every month we show you the jobs it brought in.",
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

export const faqs: Faq[] = [
  {
    q: "Which contractors do you build websites for?",
    a: "Foundation repair, crawl space and siding companies. Many of them also sell basement waterproofing, drainage, concrete lifting, windows or gutters, and your site covers those too.",
  },
  {
    q: "What do I get with the free homepage design?",
    a: "A homepage designed for your company, with your logo, colours, services and the towns you work in. If you already have a website, we'll also tell you what's worth keeping. It's free, and you don't have to buy anything.",
  },
  {
    q: "What does a website cost?",
    a: "It depends on the size of your business. Once you've seen your free homepage design you get a fixed price in writing, so there are no surprises.",
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
