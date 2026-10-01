/**
 * Content model for the Daybreak agency site.
 *
 * One rule runs through this file: nothing in here asserts a result Daybreak
 * has not produced, and nothing in here is attributed to a person who did not
 * say it.
 *
 * There is no `proof`, `testimonials` or `caseStudies` export. Those existed
 * as empty arrays with placeholder fallbacks behind them, which is one careless
 * commit away from shipping invented client results — so the shape is gone
 * rather than left switched off. Where the page genuinely needs figures to make
 * a structural point (the funnel, the attribution report, the territory plot),
 * they are worked examples, they describe nobody, and the component renders an
 * on-screen label saying so. That labelling is load-bearing: SLOP.md §19 and
 * §20 are the house rule, and the FTC's Rule on Consumer Reviews and
 * Testimonials (16 CFR Part 465) plus the substantiation requirement under FTC
 * Act §5 make an unlabelled invented figure or quote a legal exposure rather
 * than a matter of taste.
 *
 * When real client results exist, add them with the client named, the source
 * stated (their CRM export) and the measurement window dated — and never as a
 * bare percentage in a strip.
 */

export const agency = {
  name: "Daybreak Structure-Works",
  descriptor: "Foundation & Exterior Growth",
  positioning:
    "We build websites and lead systems for foundation repair, crawl space and siding companies.",
  // TODO(daybreak): replace with real contact details before launch. These are
  // placeholders and are not wired to anything.
  email: "contact@daybreaktechinnovations.com",
  bookingUrl: "#free-design",
  social: {
    linkedin: "https://linkedin.com",
  },
} as const;

/**
 * The facts the legal pages are built from.
 *
 * Every value marked TODO is a placeholder and has to be replaced with the
 * registered entity's real details before this site handles live traffic. The
 * policies themselves are accurate descriptions of what the code actually does
 * — no cookies, no analytics, no advertising pixels, no sale of personal
 * information — but a privacy policy that names a fictional company at a
 * fictional address is not a privacy policy, it is a liability.
 *
 * `effective` must be bumped whenever a policy changes in substance. US state
 * privacy statutes require the date to reflect the current version, and CalOPPA
 * (Cal. Bus. & Prof. Code §22575) specifically requires the policy to identify
 * its effective date and describe how changes are announced.
 */
export const legal = {
  /** TODO(daybreak): the registered legal entity, exactly as filed. */
  entity: "Daybreak Growth Systems, LLC",
  /** TODO(daybreak): the state of formation. Governs the terms and the venue. */
  state: "Texas",
  /** TODO(daybreak): a real mailing address. US privacy statutes require a
   *  contact route that is not only a web form. */
  address: "Address to be published before launch",
  /** TODO(daybreak): a monitored inbox. Privacy requests have statutory
   *  response deadlines — 45 days in California, and this address is where the
   *  clock starts. */
  privacyEmail: "privacy@daybreak.example.com",
  /** Last substantive revision of the policies. Bump on every change. */
  effective: "September 30, 2026",
} as const;

export type Founder = {
  name: string;
  role: string;
  /** 4:5 editorial crop, for the team section. */
  portrait: string;
  /** 1:1 head-and-shoulders crop, for the byline beside the audit form. */
  headshot: string;
  /**
   * Optional, rendered under the name when set. Left unset on purpose: both
   * names currently sit on every part of the work, and splitting that into two
   * tidy specialisms for a website would be a claim rather than a fact.
   */
  focus?: string;
};

/**
 * The two founders. Names, roles and photographs, and deliberately nothing
 * else — no years in the trade, no client counts, no former employers, since
 * none of that is checkable by the person reading it. The photographs are the
 * only piece of proof on this page that needs no disclaimer under it.
 */
export const founders: Founder[] = [
  {
    name: "Jared",
    role: "Co-founder",
    portrait: "/images/team/jake.jpg",
    headshot: "/images/team/jake-sq.jpg",
  },
  {
    name: "Yaaseen",
    role: "Co-founder",
    portrait: "/images/team/yaaseen.jpg",
    headshot: "/images/team/yaaseen-sq.jpg",
  },
];

/**
 * Sample figures for the attribution view in the "How it works" story.
 * Labelled on screen as a sample. These describe a plausible mid-size
 * foundation repair company so the shape of the report is legible; they are
 * not any client's numbers.
 */
export const sampleAttribution = {
  period: "Sample month",
  headline: [
    { label: "Leads", value: 118 },
    { label: "Inspections", value: 52 },
    { label: "Closed jobs", value: 21 },
    { label: "Pipeline", value: 246800, currency: true },
  ],
  sources: [
    { name: "Google organic", leads: 38, jobs: 7 },
    { name: "Google Maps", leads: 31, jobs: 6 },
    { name: "Google Ads", leads: 24, jobs: 4 },
    { name: "Direct", leads: 15, jobs: 3 },
    { name: "Referral", leads: 10, jobs: 1 },
  ],
} as const;
