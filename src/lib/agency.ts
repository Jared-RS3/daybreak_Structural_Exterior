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
  email: "contact@daybreakstructureworks.com",
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
 * — analytics only with consent (and none at all while NEXT_PUBLIC_GA_ID is
 * unset), no advertising pixels, no sale of personal information — but a privacy policy that names a fictional company at a
 * fictional address is not a privacy policy, it is a liability.
 *
 * Daybreak Structure-Works is a trading name. The company behind it is
 * registered in South Africa, so the policies answer to South African law
 * (POPIA, PAIA, the Companies Act) as well as to the US laws that cover the
 * contractors this site is for. POPIA applies to everything a South African
 * company processes, including details sent in by a contractor in Texas.
 *
 * What is safe to publish here: the registered name, registration number,
 * VAT number and registered address are already public on the CIPC register,
 * and the Companies Act expects the first two on the company's website. Never
 * add a director's ID number, a tax reference number or bank details, and
 * never upload the CIPC registration certificate itself — it lists the
 * directors' ID numbers.
 *
 * `effective` must be bumped whenever a policy changes in substance. US state
 * privacy statutes require the date to reflect the current version, and CalOPPA
 * (Cal. Bus. & Prof. Code §22575) specifically requires the policy to identify
 * its effective date and describe how changes are announced.
 */
export const legal = {
  /** TODO(daybreak): the registered legal entity, exactly as filed. */
  entity: "DayBreak Tech-Innovations (Pty) Ltd",
  /** The name the site trades under. The privacy policy says whose it is. */
  tradingName: agency.name,
  /** The company's short name and its own website, linked from the footer.
   *  TODO(daybreak): confirm the URL is the Daybreak company site. */
  company: "Daybreak",
  companyUrl: "https://daybreaktech.agency",
  /** Where the company is registered. Also the Terms of Use governing law
   *  and the courts disputes go to. */
  country: "South Africa",
  /** TODO(daybreak): the CIPC registration number, e.g. "2024/123456/07".
   *  Companies Act 71 of 2008 s32(4) requires a company's name and
   *  registration number on its official publications, electronic ones
   *  included. Left empty, the line is not shown. */
  registrationNumber: "",
  /** Only if the company is registered for VAT. Left empty, not shown. */
  vatNumber: "",
  /** TODO(daybreak): a real mailing address. US privacy statutes require a
   *  contact route that is not only a web form, and POPIA s18 requires the
   *  responsible party's address. A business or postal address is enough;
   *  it does not have to be anyone's home. */
  address: "Address to be published before launch",
  /** TODO(daybreak): the Information Officer's name. Under POPIA that is the
   *  head of the company (a director) unless someone else is formally
   *  designated, and they must be registered with the Information Regulator
   *  (eservices.inforegulator.org.za). Left empty, the policy names the role
   *  only. */
  informationOfficer: "",
  /** TODO(daybreak): a monitored inbox. Privacy requests have statutory
   *  response deadlines — 45 days in California, and this address is where the
   *  clock starts. */
  privacyEmail: "contact@daybreaktech.agency",
  /** TODO(daybreak): a phone number for the Information Officer, in
   *  international form (+27 …) since most visitors dial from the US. PAIA
   *  s51 lists it among the manual's contact details. Left empty, not shown. */
  phone: "",
  /** Last substantive revision of the policies. Bump on every change. */
  effective: "2026",
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
