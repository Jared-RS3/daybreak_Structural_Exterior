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
  /** The free concept is asked for on the short form (#free-design, at the
      foot of every sales page), which then hands off to the booking calendar
      with the visitor's details filled in. Asking on the form first means a
      lead who never books still reaches the Airtable base. The header moves
      to the form on the current page when there is one (SiteHeader). */
  offerHref: "/#free-design",
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
    "We're Jared and Yaaseen. We build the lead infrastructure behind foundation repair, crawl space and siding companies, from the first click to the booked inspection. The website is where it starts, and we judge our work by how many inspections it books.",
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
  label: "Free call + homepage concept",
  /** Every button that leads to the form. It says what happens (a call); the
      free concept is the reason to book it, said beside the button. */
  cta: "Book my free call",
  /** The form's own button: the calendar comes next, so it says so. */
  submit: "Next: pick a time",
  includes: [
    "A call with both founders",
    "A concept of your homepage",
    "Your service area & towns",
    "Your repairs & services",
    "Notes on your current site",
  ],
  reply: "within one business day",
  /** The form section at the foot of every sales page. */
  formTitle: "Book your free call.",
  formLede:
    "Answer a few quick questions about your business, then pick a time. We'll design a concept of your new homepage, with your logo, services and towns, and show it to you on the call. No cost, no obligation.",
};

/**
 * The founding-client offer: Daybreak has no contractor results yet, so the
 * first contractor clients get a lower rate in exchange for being the proof.
 * The rate itself is never published; it's given in writing on the call.
 *
 * Not shown on the site at the moment (the founding section and the
 * mentions of it were taken out). If it goes back, lower `left` by hand each
 * time a founding client signs, and never show more urgency than is true.
 */
export const founding = {
  spots: 10,
  left: 10,
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
      title: "Know where every lead came from",
      icon: "document",
      body: "Calls, forms, booked inspections and lead sources are tracked, so you can see what the site is actually producing. We go through it with you every month, including the months it isn't working yet.",
    },
  ],
};

/** Ticked under the hero buttons (the first button is the free design). Each one is true today. */
export const heroPromises = [
  "Free homepage concept",
  "Fixed price in writing",
  "No obligation",
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
  // {
  //   value: `${founding.left} founding spots`,
  //   label: "left at a founding rate",
  // },
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

/* ==========================================================================
   Lost revenue: the automations, sold as the money they stop leaking rather
   than as software. Nothing here names a tool, a webhook or "AI".

   The two industry figures are other people's research, quoted in their own
   words with the source linked and dated. They describe the industry, not
   Daybreak's results, and the page says whose they are. Check the wording
   against the source before changing a number.
   ========================================================================== */

/** A third-party figure. `label` stays as close to the source's own words as one line allows. */
export type IndustryStat = {
  value: string;
  label: string;
  source: string;
  href: string;
};

export const lostLeadStats: IndustryStat[] = [
  {
    value: "48%",
    label: "of callers to home service businesses don't get to speak with a person.",
    source: "Invoca, Home Services Lead Conversion Benchmarks, 2026",
    href: "https://www.invoca.com/reports/the-invoca-home-services-lead-conversion-benchmarks-report-2026",
  },
  {
    value: "11–15%",
    label:
      "of income comes from following up on estimates, say nearly half of $10M+ contractors.",
    source: "ServiceTitan, Residential Services Report, 2025",
    href: "https://www.servicetitan.com/press/residential-industry-report-2025",
  },
];

/** The band under the hero. The leak names match the three cards below. */
export const leakBand = {
  quiet: "You may not need more leads.",
  loud: "You may need to stop losing the ones you already paid for.",
  leaks: ["Missed calls", "Slow replies", "Unsold estimates"],
  cta: "See where you're losing leads",
};

/**
 * The three leaks. `scene` picks the drawing of the leak itself in
 * components/daybreak/LeakScenes.tsx; `flow` is what Daybreak sets running
 * instead, step by step. `stat` is either a sourced industry figure or, for
 * slow replies, what the automation itself does (a spec, not a result).
 */
export type Leak = {
  name: string;
  scene: "missed" | "slow" | "unsold";
  problem: string;
  flow: string[];
  stat: { value: string; label: string; source?: string; href?: string };
};

export const leaks: Leak[] = [
  {
    name: "Missed calls",
    scene: "missed",
    problem:
      "Someone calls while your crew is on site. Nobody answers, so they call the next contractor.",
    flow: ["Missed call", "Text in seconds", "Questions", "Inspection request"],
    stat: lostLeadStats[0],
  },
  {
    name: "Slow website leads",
    scene: "slow",
    problem:
      "A homeowner fills in your form at 8:43 PM. Nobody replies until tomorrow.",
    flow: [
      "Form sent",
      "Text in seconds",
      "Questions",
      "Photos",
      "ZIP check",
      "Inspection booked",
    ],
    stat: {
      value: "30 sec",
      label: "to the first reply on every web form, at any hour.",
    },
  },
  {
    name: "Unsold estimates",
    scene: "unsold",
    problem:
      "You paid for the lead, drove out and wrote the quote. Then they go quiet.",
    flow: [
      "Estimate sent",
      "Follow-ups",
      "Payment options",
      "Rep alerted when they reply",
    ],
    stat: lostLeadStats[1],
  },
];

/**
 * The strip ahead of "Our work": the whole path in single words, so the
 * visitor has the system in mind before they see the design work. `mark` is
 * the step the path exists for.
 */
export const systemStrip = {
  title:
    "We build the full path from a homeowner's Google search to a booked inspection, and on to the review after the job.",
  steps: [
    "Get found",
    "Website",
    "Qualify",
    "Respond",
    "Book",
    "Follow up",
    "Track",
    "Get reviews",
  ],
  mark: "Book",
};

/**
 * The three trades don't sell the same way, so the site doesn't ask the same
 * questions. Each journey is what a Daybreak site for that trade is built to
 * do, from the first thing the homeowner tells it to the hand-off. The
 * foundation journey is the crack checker on this page.
 */
export const leadJourneys: {
  trade: string;
  opener: string;
  steps: string[];
  /** Its trade page. */
  href: string;
}[] = [
  {
    trade: "Foundation repair",
    href: "/foundation-repair-websites",
    opener: "Starts with a crack the homeowner just noticed.",
    steps: [
      "Crack & symptom checker",
      "Severity",
      "Photos",
      "Inspection",
      "CRM",
    ],
  },
  {
    trade: "Crawl space",
    href: "/crawl-space-websites",
    opener: "Starts with a smell, damp or a floor that's started to give.",
    steps: [
      "Moisture, smell or sagging-floor diagnosis",
      "Property details",
      "Photo upload",
      "Inspection",
    ],
  },
  {
    trade: "Siding",
    href: "/siding-websites",
    opener: "Starts with damage, or a house that's due for new siding.",
    steps: [
      "Damage, replacement or material preference",
      "Project qualifier",
      "Estimate request",
      "Consultation",
    ],
  },
];

/**
 * The second leak, shown: an estimate followed up five times over 30 days
 * (the same cadence as `outcomes`). `day` counts from the estimate. Only the
 * first step is done by a person; the rest run on their own and stop the
 * moment the homeowner replies.
 */
export const estimateFollowUp = {
  label: "The second leak",
  title: "Estimate sent Monday.",
  lede: "You paid for the lead, drove out and wrote the quote. From there, every estimate is followed up five times over 30 days, and your rep is alerted the moment the homeowner replies.",
  steps: [
    { when: "Monday", day: 0, text: "Estimate delivered", kind: "Your rep" },
    {
      when: "Wednesday",
      day: 2,
      text: "“Did the estimate come through OK?”",
      kind: "Automatic",
    },
    {
      when: "Friday",
      day: 4,
      text: "“Any questions about the repair options?”",
      kind: "Automatic",
    },
    {
      when: "Next week",
      day: 9,
      text: "“Would monthly payments make this easier?”",
      kind: "Automatic",
    },
    {
      when: "Week 3",
      day: 16,
      text: "“Still thinking it over? Here's what to watch for in the meantime.”",
      kind: "Automatic",
    },
    { when: "A month on", day: 30, text: "Final follow-up", kind: "Automatic" },
  ],
  reply:
    "They reply, the follow-ups stop, and your rep gets the estimate and the whole conversation.",
};

/**
 * The live run: one missed call, followed until it's a booked inspection in
 * the CRM. Each step is one change on the phone in the drawing.
 */
/** The live run's heading, shared by / and /how-it-works so they never drift. */
export const liveRunCopy = {
  label: "How it works",
  /** Two lines, broken between them. */
  title: ["A missed call at 4:52 PM.", "Booked by 4:57."],
  lede: "Nobody in the office touched it. This is what runs behind your website while your team is under a house, on site or off for the day: the text back, the questions, the photos, the booking and the CRM.",
};

export const liveRun = [
  "Homeowner calls",
  "Call missed",
  "Text sent in seconds",
  "“What issue are you seeing?”",
  "Foundation cracks",
  "ZIP confirmed",
  "Photos uploaded",
  "Inspection booked",
  "CRM updated",
];

export const beforeAfter: Comparison = {
  usual: {
    label: "Before Daybreak",
    steps: [
      { label: "Lead comes in" },
      { label: "Goes to voicemail", wait: true },
      { label: "Written into a spreadsheet", wait: true },
      { label: "Someone remembers to call back", wait: true },
      { label: "Quote sent" },
      { label: "Homeowner disappears", wait: true },
    ],
  },
  ours: {
    label: "After Daybreak",
    steps: [
      "Lead comes in",
      "Instant reply",
      "Qualifying questions",
      "Inspection booked",
      "CRM tracks the job",
      "Quote followed up",
      "Review request after the job",
    ],
    fastSteps: 3,
    fastLabel: "In the first minute",
    note: "Every lead gets an answer, a booking and a follow-up, even when nobody's in the office.",
  },
};

/**
 * What the contractor gets, as outcomes. `how` names the automations behind
 * each one, in plain words, so all of them appear without a feature list.
 */
export const outcomes: { title: string; how: string[] }[] = [
  {
    title: "Respond faster",
    how: ["Instant reply to web forms", "Missed-call text-back"],
  },
  {
    title: "Book more inspections",
    how: ["Online booking", "Reminders 24 hrs and 2 hrs before"],
  },
  {
    title: "Follow up with every estimate",
    how: ["5 follow-ups over 30 days", "Payment options on large quotes"],
  },
  {
    title: "Recover missed opportunities",
    how: ["Old leads contacted again", "Rep alerted when they reply"],
  },
  {
    title: "Get more 5-star reviews",
    how: ["Google review request after every job"],
  },
  {
    title: "Know where every lead stands",
    how: ["Pipeline that updates itself"],
  },
];

/**
 * Tools the automations connect to, shown as "Works with the tools you
 * already use". Hidden while empty.
 *
 * TODO(daybreak): list only tools you have actually connected for a client
 * (e.g. "Airtable", "Google Calendar"). A name here is a promise.
 */
export const integrations: string[] = [];

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

/**
 * What happens on the first call, for the homepage. Step two is where the
 * lost-revenue calculator (/calculator) gets used, on screen with the
 * contractor's own numbers, rather than left on the page to fill in alone.
 */
export const callSteps: ProcessStep[] = [
  {
    title: "See your homepage",
    body: "We show you a concept of your new homepage, with your logo, your services and the towns you work in.",
    detail: "Free, no obligation",
  },
  {
    title: "Find your leaks",
    body: "Together we go through your missed calls, reply times and unsold estimates, and work out what they're costing you each month.",
    detail: "Your numbers, worked out live",
  },
  {
    title: "Get a fixed price",
    body: "If it's a fit, you get a fixed price in writing for the site and the automations. Nothing starts until you've signed off.",
    detail: "No surprises",
  },
];

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
    "The process was straightforward from our first call through launch, and the final site matched our brand perfectly. It feels polished, clear and easy for customers to navigate.",
    "Matched our brand perfectly",
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
    q: "Who is Daybreak Structure-Works built for?",
    a: "Foundation repair, crawl space and siding contractors. We build the website, qualification tools, follow-up and CRM workflow around how those businesses actually sell. Many of them also sell basement waterproofing, drainage, concrete lifting, windows or gutters, and your site covers those too.",
  },
  {
    q: "Why work with two founders instead of a big agency?",
    a: "You deal with the people doing the work, from the first call to launch day, with no account managers in between. You see a concept of your own homepage before you pay anything, the price is fixed in writing before anything starts, and your site, domain and data are in your name. Every client we've built for is still with us.",
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
    q: "Does it work with my CRM, or do I have to switch?",
    a: "You don't have to switch. If you already run your jobs in a CRM, we check on the first call whether new leads can go straight into it, and tell you before you pay anything. If you don't use one, or yours can't connect, we set up a simple pipeline in your name, so every lead, booking and estimate is in one place.",
  },
  {
    q: "Who owns the website?",
    a: "You do. The site, the domain and all your data are yours, and if you ever leave, you take it all with you.",
  },
  {
    q: "What is the crack checker?",
    a: "A short set of questions a homeowner answers about a crack: where it is, what it looks like, how wide it is and what else the house is doing. It tells them how serious it probably is, books the right inspection and can email them the report as a PDF. Try it from the yellow button in the corner of this page, and you'll get the PDF yourself.",
  },
  {
    q: "What is the house estimator?",
    a: "A tool on your site where homeowners click the problem or tick their symptoms, pick a size, and get a ballpark price once they've left their details. They're emailed the estimate as a PDF, and it reaches you as a lead with the job already described, using your prices, not ours. Try it from the yellow button in the corner and we'll email you the PDF.",
  },
];

/* ==========================================================================
   Trade pages: one landing page per trade (/foundation-repair-websites,
   /crawl-space-websites, /siding-websites), for the contractor who searches
   for their own trade and wants to see that we know how it sells.

   Same rule as the rest of this file: the leaks are described, never given a
   number nobody measured, and every "fixed by" names something shown on the
   homepage or listed as live in `trades`.
   ========================================================================== */

const sharedFaq = (q: string) => {
  const f = faqs.find((x) => x.q === q);
  if (!f) throw new Error(`No FAQ "${q}"`);
  return f;
};

export type TradePage = {
  path: string;
  /** For the <title>, before the site name. */
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** e.g. "foundation repair", for running copy. */
  short: string;
  leaksTitle: string;
  leaksLede: string;
  /** Where this trade's leads leak, and what fixes each one. */
  leaks: ProcessStep[];
  journey: (typeof leadJourneys)[number];
  /** Concept ids from the work showcase. */
  concepts: string[];
  /** Show the crack & symptom checker. */
  tool: boolean;
  /** The repair estimate\'s section to open first. */
  focus: string;
  /** Show the missed-call run (it's drawn for a foundation company). */
  run: boolean;
  /** Behind the form at the foot of the page. */
  image: string;
  /** Beside the headline: the problem as the homeowner sees it. */
  heroImage: { src: string; alt: string };
  faqs: Faq[];
};

export const tradePages: Record<"foundation" | "crawl" | "siding", TradePage> =
  {
    foundation: {
      path: "/foundation-repair-websites",
      title: "Foundation Repair Contractor Websites",
      description:
        "Websites and lead systems for foundation repair contractors: a crack & symptom checker, replies in seconds, inspection booking and estimate follow-up. See a free concept of your homepage first.",
      h1: "Websites and lead systems for foundation repair contractors.",
      lede: "Foundation leads start with a worried homeowner and end in a big-ticket decision. We build the site that answers the worry, books the inspection and follows up on the estimate until they decide.",
      short: "foundation repair",
      leaksTitle: "Where foundation repair leads leak.",
      leaksLede:
        "Three moments where a homeowner who was ready to call you ends up calling someone else.",
      leaks: [
        {
          title: "The 9 PM worry",
          body: "A homeowner spots a stair-step crack after dinner and wants to know if the house is safe. If your site can't tell them, they keep searching until one does.",
          detail: "Fixed by the crack & symptom checker",
        },
        {
          title: "Three quotes on the table",
          body: "Homeowners often have more than one company out. The one that replies first and explains the repair clearly is the one they remember.",
          detail: "Fixed by a text back in seconds",
        },
        {
          title: "The estimate that goes quiet",
          body: "Pier work is a big decision. Without follow-up, your estimate sits on the kitchen table until another company calls.",
          detail: "Fixed by 5 follow-ups over 30 days",
        },
      ],
      journey: leadJourneys[0],
      concepts: ["cornerstone", "bedrock", "keystone"],
      tool: true,
      run: true,
      focus: "foundation",
      image: "/images/foundation-excavation.jpg",
      heroImage: {
        src: "/images/foundation-crack-brick.jpg",
        alt: "A stair-step crack running through a brick wall",
      },
      faqs: [
        {
          q: "Can the crack checker use my prices and repair methods?",
          a: "Yes. On your site, its answers, price ranges and booking options are set to your repair methods and the area you work in. Try it from the yellow button in the corner of this page.",
        },
        {
          q: "Will the site cover waterproofing, drainage and concrete lifting too?",
          a: "Yes. Many foundation companies also sell basement waterproofing, drainage or concrete lifting, and your site covers those services too.",
        },
        sharedFaq("What does a website cost?"),
        sharedFaq("Does it work with my CRM, or do I have to switch?"),
        sharedFaq("Is the concept my finished design?"),
        sharedFaq("Who owns the website?"),
      ],
    },
    crawl: {
      path: "/crawl-space-websites",
      title: "Crawl Space Contractor Websites",
      description:
        "Websites and lead systems for crawl space contractors: questions for musty smells, damp and sagging floors, photo upload, inspection booking and estimate follow-up. See a free concept of your homepage first.",
      h1: "Websites and lead systems for crawl space contractors.",
      lede: "Most homeowners don't know they have a crawl space problem. They know the house smells musty or a floor feels soft. We build the site that connects the symptom to an inspection, then books it.",
      short: "crawl space",
      leaksTitle: "Where crawl space leads leak.",
      leaksLede:
        "The homeowner can't see the problem, doesn't know its name, and is surprised by the price. Each of those loses you jobs.",
      leaks: [
        {
          title: "They search the symptom",
          body: "Homeowners type “musty smell in house” or “soft spot in floor”, not “crawl space encapsulation”. A site that only lists your services never meets them.",
          detail: "Fixed by symptom question paths",
        },
        {
          title: "Nobody wants to go down there",
          body: "The homeowner can't see the problem, so they can't describe it on the phone. Questions and photos on the site give you the picture before you drive out.",
          detail: "Fixed by questions & photo upload",
        },
        {
          title: "A bigger number than they pictured",
          body: "Encapsulation often costs more than the homeowner expected. Without follow-up and payment options, the estimate stalls.",
          detail: "Fixed by follow-up & payment options",
        },
      ],
      journey: leadJourneys[1],
      concepts: ["dryline", "keystone"],
      tool: true,
      run: false,
      focus: "crawl",
      image: "/images/crawl-inspection.jpg",
      heroImage: {
        src: "/images/crawl-space-before.jpg",
        alt: "A damp crawl space under a house, before any work",
      },
      faqs: [
        {
          q: "Can the site handle musty smells, damp and sagging floors?",
          a: "Yes. The site asks what the homeowner is noticing, like a smell, damp or a soft floor, and books the right inspection. Try the symptom answers from the yellow button in the corner of this page.",
        },
        {
          q: "Do you build before & after pages for encapsulation jobs?",
          a: "Yes. Encapsulation sells on before & after photos, so your site gets a page for each job you want to show, with the photos and what you did.",
        },
        sharedFaq("What does a website cost?"),
        sharedFaq("Does it work with my CRM, or do I have to switch?"),
        sharedFaq("Is the concept my finished design?"),
        sharedFaq("Who owns the website?"),
      ],
    },
    siding: {
      path: "/siding-websites",
      title: "Siding Contractor Websites",
      description:
        "Websites and lead systems for siding contractors: project and material pages, a project qualifier, estimate requests and follow-up until the homeowner decides. See a free concept of your homepage first.",
      h1: "Websites and lead systems for siding contractors.",
      lede: "Siding is a looks-and-money decision, and homeowners take their time over it. We build the site that shows your work, qualifies the project and keeps your estimate alive until they're ready.",
      short: "siding",
      leaksTitle: "Where siding leads leak.",
      leaksLede:
        "Siding homeowners browse longer, compare more and decide slower. The site has to work for all of it.",
      leaks: [
        {
          title: "They shop with their eyes",
          body: "Homeowners want to see the material, the colour and a house like theirs. A thin gallery sends them to the next contractor's site.",
          detail: "Fixed by project & material pages",
        },
        {
          title: "Not every lead is a project",
          body: "A cracked panel and a whole-house replacement shouldn't get the same call. The site asks first, so your estimators drive out for the right jobs.",
          detail: "Fixed by the project qualifier",
        },
        {
          title: "The long goodbye",
          body: "Siding decisions take weeks, sometimes a season. Without follow-up, your estimate is forgotten by the time they're ready.",
          detail: "Fixed by 5 follow-ups over 30 days",
        },
      ],
      journey: leadJourneys[2],
      concepts: ["clapboard"],
      tool: false,
      run: false,
      focus: "siding",
      image: "/images/siding-crew.jpg",
      heroImage: {
        src: "/images/siding-white-colonial.jpg",
        alt: "A colonial house with new white lap siding",
      },
      faqs: [
        {
          q: "Can homeowners pick materials and colours on the site?",
          a: "Yes. Our Clapboard concept puts a material and colour picker near the top of the homepage, and the house estimator (the yellow button in the corner) prices each material. What goes on your site depends on the materials you install.",
        },
        {
          q: "Do you build a page for each siding material?",
          a: "Yes. Fiber cement, vinyl, engineered wood or whatever you install each get their own page, written for the homeowner comparing them.",
        },
        sharedFaq("What does a website cost?"),
        sharedFaq("Does it work with my CRM, or do I have to switch?"),
        sharedFaq("Is the concept my finished design?"),
        sharedFaq("Who owns the website?"),
      ],
    },
  };
