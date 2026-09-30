/* ==========================================================================
   Daybreak Foundation & Exteriors — content for the reference build

   This file is the whole client. Components in components/template/ render
   whatever is here; to build a site for a real foundation, crawl space or
   siding contractor, copy this file, replace the content, and point the
   route at it.

   EVERYTHING BELOW DESCRIBES A FICTIONAL CONTRACTOR. The company, reviews,
   ratings, project histories, guarantees, lead times, prices and counts are
   written so the layouts can be judged with realistic content in them.
   Sections that carry proof also carry an on-screen "illustrative" tag (see
   `illustrative` below). Before any of this ships for a real business:

     - replace, never tag-and-keep, every review (16 CFR Part 465)
     - replace ratings and counts with the client's real figures or delete them
     - replace `guarantees` with the terms in the client's actual contract
     - set `publishStructuredData: true` only once the business facts are real
   ========================================================================== */

import type {
  Area,
  Business,
  Comparison,
  Faq,
  Guarantee,
  Problem,
  ProcessStep,
  Project,
  ProofItem,
  RatingSummary,
  Review,
  Service,
  SiteTheme,
  ToolConfig,
  TrustItem,
} from "./template/types";

/**
 * The demo is hosted inside the agency site rather than at its own root, so
 * every internal link is written against this base. Changing it here moves
 * the whole reference build.
 */
export const demoBase = "/work/daybreak-foundation";

/** The homepage, for links back to it. `demoBase` alone is "" at the root. */
export const homeHref = demoBase || "/";

/** Absolute URL of the site root, for structured data. Matches `metadataBase`. */
export const siteUrl = `https://daybreak.example.com${demoBase}`;

/** Shows the on-screen "illustrative" tags on proof sections. */
export const illustrative = true;

/** Emit contractor / FAQPage / Service JSON-LD. Off: the business is fictional. */
export const publishStructuredData = false;

/** Brand override. Empty = template defaults from globals.css. */
export const siteTheme: SiteTheme = {};

/**
 * The house that stands in the sky on the hero and the closing section — a
 * transparent cut-out, so it sits in the gradient with no rectangle. Made
 * from /images/project-modern.jpg by removing its sky.
 */
export const houseImage = {
  src: "/images/home-modern-cutout.webp",
  alt: "A two-storey rendered home with a slab foundation, standing against the sky",
  width: 1470,
  height: 1030,
};

export const company: Business = {
  name: "Daybreak Foundation & Exteriors",
  descriptor: "Foundation & Exteriors",
  legal: "Daybreak Foundation & Exteriors, LLC",
  phoneDisplay: "(817) 555-0142",
  phoneHref: "tel:+18175550142",
  // A reserved .example domain: the company is fictional, and a plausible
  // .com could belong to a real contractor.
  email: "hello@daybreakfoundation.example",
  address: {
    street: "4820 Meacham Blvd, Suite 210",
    city: "Fort Worth",
    state: "TX",
    zip: "76106",
  },
  locality: "Fort Worth, TX",
  region: "the DFW Metroplex",
  hours: [
    { d: "Monday – Friday", h: "7:00 AM – 6:00 PM" },
    { d: "Saturday", h: "8:00 AM – 2:00 PM" },
    { d: "Sunday", h: "Closed" },
  ],
  founded: 2004,
  license: "Insured to $2M · Engineer-approved repairs",
  geo: { lat: 32.8232, lng: -97.3421 },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
};

/** The live tool: four questions about a crack, and an honest read on it. */
export const tool: ToolConfig = {
  name: "Crack & symptom checker",
  cta: "Check my crack",
  href: `${demoBase}/crack-checker`,
  inputLabel: "Your crack",
  placeholder: "",
  reassurance: "Free. Nothing is sent anywhere, and nobody calls unless you ask them to.",
  steps: [
    {
      title: "Tell us what you see",
      body: "Where the crack is, what it looks like, how wide it is, and anything else the house is doing. Four taps.",
    },
    {
      title: "See how serious it is",
      body: "A plain answer, the usual cause, and what a fix typically costs in North Texas.",
    },
    {
      title: "Book the right visit",
      body: "If it's worth a look, book a free inspection and elevation survey. If it isn't, we'll say so.",
    },
  ],
};

/** The site's main call to action. */
export const quoteCta = { label: "Get a free inspection", href: `${demoBase}/book` };

export const rating: RatingSummary = { score: "4.9", count: 868, source: "Google" };

export const trust: TrustItem[] = [
  { value: "4.9", label: "868 Google reviews", rating: true },
  { value: "Licensed", label: "& insured · $2M liability" },
  { value: "3,900+", label: "homes since 2004" },
  { value: "Lifetime", label: "transferable pier warranty" },
  { value: "0% APR", label: "12-month financing" },
];

export const services: Service[] = [
  {
    slug: "foundation-repair",
    group: "specialty",
    title: "Foundation Repair",
    short: "Steel piers driven to load-bearing soil, with a lifetime transferable warranty.",
    blurb:
      "North Texas clay swells when it's wet and shrinks when it's dry, and your slab rides it. We measure how far each part of the house has moved, then drive steel piers under the settling beams until they stop on soil that doesn't move, and lift the house back as far as it will safely go.",
    image: "/images/foundation-underpin.jpg",
    icon: "foundation",
    priceFrom: "$1,350/pier",
    timeline: "1–3 days on site",
    projectCategories: ["Foundation"],
    leadsWith: "tool",
    problemId: "cracks",
    highlights: [
      "Free elevation survey before any price",
      "Steel push piers driven to refusal, not a set depth",
      "Lifetime warranty that transfers when you sell",
      "Engineer's letter for your files and your buyer",
    ],
    includes: [
      {
        title: "Elevation survey",
        body: "We shoot the floor with a digital level at dozens of points and hand you the map. You see where the house has dropped and by how much before anyone talks about piers.",
      },
      {
        title: "Piers driven to refusal",
        body: "Each steel pier is hydraulically pressed until the house itself can't push it any deeper. Every pier's final depth and pressure is logged and goes in your warranty file.",
      },
      {
        title: "A careful lift",
        body: "The house is raised in small steps, with doors and windows checked at each one. We stop when it's level or when lifting further would crack finishes, whichever comes first.",
      },
      {
        title: "Your yard put back",
        body: "Excavations are backfilled and compacted, beds are replanted and sod is relaid. A plumbing test after the lift confirms nothing under the slab was disturbed.",
      },
    ],
    faqs: [
      {
        q: "How many piers will my house need?",
        a: "It depends on how much of the foundation is moving. One settling corner often takes four to six piers; a whole side of an average Fort Worth home takes eight to twelve. The elevation survey tells us, and the number is fixed in writing before we start.",
      },
      {
        q: "Will you get my house perfectly level?",
        a: "Not always, and anyone who promises it is guessing. A house that has sat out of level for years has settled into it. We lift to the best practical recovery without cracking walls, and we tell you the target before we start.",
      },
      {
        q: "Do I need to leave during the work?",
        a: "No. Most of the work is outside, and the lift itself takes a few hours. We'll ask you to take fragile items off walls on the side we're lifting.",
      },
    ],
  },
  {
    slug: "pier-and-beam",
    group: "specialty",
    title: "Pier & Beam Repair",
    short: "Re-shimming, new piers and sill repair under older homes.",
    blurb:
      "Fort Worth's older neighborhoods are full of pier-and-beam homes, and most of their problems are underneath: wood shims that have crushed, cedar stumps that have rotted and sill plates that have gone soft. We crawl it, measure it and fix what's failing, and leave the rest alone.",
    image: "/images/pier-porch-house.jpg",
    icon: "foundation",
    priceFrom: "$2,400",
    timeline: "1–2 days on site",
    projectCategories: ["Pier & beam"],
    leadsWith: "inspect",
    problemId: "floors",
    highlights: [
      "Steel shims replace crushed wood",
      "Concrete piers replace rotted cedar",
      "Sill plate and joist repair where needed",
      "Floor levelled room by room",
    ],
    includes: [
      {
        title: "A full crawl",
        body: "We go under the whole house, not just the bouncy room, and photograph every pier, beam and sill we'd touch. You get the photos.",
      },
      {
        title: "Re-shimming",
        body: "Crushed and split wood shims come out and steel shims go in, adjusted beam by beam until the floor above reads level.",
      },
      {
        title: "Pier replacement",
        body: "Rotted cedar stumps and cracked block piers are replaced with poured concrete piers on proper footings.",
      },
      {
        title: "Sill & joist repair",
        body: "Soft sill sections are cut out and replaced, and sagging joists are sistered, so the new shims have something solid to hold up.",
      },
    ],
    faqs: [
      {
        q: "How often does pier and beam need re-shimming?",
        a: "With steel shims on sound piers, rarely. Wood shims compress and shift every few years, which is why so many older homes need attention again and again.",
      },
      {
        q: "Can you fix just the one room that slopes?",
        a: "Often, yes. If the problem is local, we fix it locally. We'll show you the photos from the rest of the crawl so you know whether anything else is heading the same way.",
      },
    ],
  },
  {
    slug: "crawl-space-encapsulation",
    group: "specialty",
    title: "Crawl Space Encapsulation",
    short: "A 20-mil liner, sealed vents and a dehumidifier sized to the space.",
    blurb:
      "An open, vented crawl space pulls humid Texas air under the house, where it condenses on cool ducts and joists. That's where the musty smell, the cupping floors and the mold come from. Encapsulation closes the space off and dries it out, so the air under your floor is as dry as the air above it.",
    image: "/images/crawl-foam.jpg",
    icon: "crawl",
    priceFrom: "$6,800",
    timeline: "2–3 days on site",
    projectCategories: ["Crawl space"],
    leadsWith: "inspect",
    problemId: "musty",
    highlights: [
      "20-mil reinforced liner, seams taped",
      "Liner run up the walls and sealed",
      "Vents and rim joists sealed",
      "Dehumidifier with humidity readout",
    ],
    includes: [
      {
        title: "Clean-out first",
        body: "Old plastic, debris and wet insulation come out before anything goes in. Mold on the joists is treated, not covered.",
      },
      {
        title: "Liner & walls",
        body: "A 20-mil reinforced liner covers the ground and runs up the foundation walls, mechanically fastened and taped at every seam and pier.",
      },
      {
        title: "Vents sealed",
        body: "Foundation vents and the rim joist are sealed so humid outside air stops being pulled underneath the house.",
      },
      {
        title: "Dehumidifier",
        body: "A crawl space dehumidifier sized to the volume holds humidity near 50%, with a readout you can check without going under.",
      },
    ],
    faqs: [
      {
        q: "Shouldn't a crawl space be vented?",
        a: "That was the old code thinking. In a humid climate, vents let in more moisture than they let out. Building science and current code both allow sealed, conditioned crawl spaces for that reason.",
      },
      {
        q: "Will encapsulation lower my energy bill?",
        a: "Usually a little, because your ducts and floors sit in drier, more stable air. We don't promise a number. The reason to do it is a dry, clean crawl space and a house that doesn't smell.",
      },
      {
        q: "What about the mold that's already there?",
        a: "It gets treated before the liner goes in. Once humidity stays near 50%, mold can't come back.",
      },
    ],
  },
  {
    slug: "crawl-space-repair",
    group: "specialty",
    title: "Crawl Space Repair",
    short: "Sagging floors, rotted joists and failed supports, fixed from below.",
    blurb:
      "A bouncy kitchen floor or a sloping hallway usually starts in the crawl space: a support that's sunk, a joist that's cracked, or wood that's been damp for years. We find the cause, fix the structure and deal with the moisture, so it doesn't happen again.",
    image: "/images/crawl-inspection.jpg",
    icon: "wrench",
    priceFrom: "$1,950",
    timeline: "1–2 days on site",
    projectCategories: ["Crawl space", "Pier & beam"],
    leadsWith: "inspect",
    problemId: "floors",
    highlights: [
      "Adjustable steel support posts",
      "Sistered and replaced joists",
      "Wood rot cut out, not painted over",
      "Moisture source found and fixed",
    ],
    includes: [
      {
        title: "Support posts",
        body: "Adjustable steel posts on poured footings go under sagging girders, then are tightened in stages to bring the floor back up.",
      },
      {
        title: "Joist repair",
        body: "Cracked and overspanned joists are sistered with new lumber, glued and bolted along their length.",
      },
      {
        title: "Rot removal",
        body: "Rotted wood is cut back to sound timber and replaced. Treating soft wood without removing it just hides the problem.",
      },
      {
        title: "The moisture question",
        body: "Wood rots because it stays wet. We tell you why yours did, and what it would take to stop it.",
      },
    ],
    faqs: [
      {
        q: "Are support jacks a permanent fix?",
        a: "On proper footings, yes. Screw jacks sitting on a paver or on bare dirt aren't, and they're why so many floors sag again a few years later.",
      },
      {
        q: "My floor is bouncy but not sloped. Is that the same problem?",
        a: "Often it's joists that are undersized for the span, not a failed support. It's a smaller fix, usually sistering or a mid-span beam.",
      },
    ],
  },
  {
    slug: "drainage",
    group: "specialty",
    title: "Drainage & Moisture Control",
    short: "French drains, root barriers and downspouts that keep the soil stable.",
    blurb:
      "Most North Texas foundations move because the soil under them gets wet on one side and dry on the other. Water off the roof, a low spot by the patio or a thirsty oak tree can all do it. Fixing the water is often cheaper than fixing the foundation, and it protects the piers if you've already got them.",
    image: "/images/foundation-pour.jpg",
    icon: "drop",
    priceFrom: "$1,200",
    timeline: "1–2 days on site",
    projectCategories: ["Drainage"],
    leadsWith: "inspect",
    problemId: "water",
    highlights: [
      "French and surface drains to daylight",
      "Downspouts piped away from the slab",
      "Root barriers beside large trees",
      "Grading that sends water away",
    ],
    includes: [
      {
        title: "Where the water goes",
        body: "We watch where water runs and pools, often with a hose on the roof, before designing anything.",
      },
      {
        title: "Drains",
        body: "French drains and surface drains in gravel and fabric, sloped to daylight or to the street, not to a neighbour.",
      },
      {
        title: "Root barriers",
        body: "A vertical barrier between a large tree and your slab stops roots drying the soil under that corner.",
      },
      {
        title: "Grading",
        body: "Soil built up and sloped so the first ten feet around the house fall away from it.",
      },
    ],
    faqs: [
      {
        q: "Should I water my foundation?",
        a: "In a long dry spell, a soaker hose a foot or two from the slab can help keep the soil even. Watering is no substitute for fixing drainage that sends water to one side.",
      },
      {
        q: "Will a root barrier hurt my tree?",
        a: "Placed correctly, no. It redirects roots down and away from the house rather than cutting the tree's main roots.",
      },
    ],
  },
  {
    slug: "foundation-inspection",
    group: "specialty",
    title: "Foundation Inspections",
    short: "A free elevation survey, and an engineer's report when you need one.",
    blurb:
      "Buying, selling or just worried? We measure the whole floor, check the crawl space or the slab edges, and give you a written answer: what's moving, what isn't, and what (if anything) we'd do about it. When a lender or buyer needs it, a licensed engineer writes the report.",
    image: "/images/inspectors-tablet.jpg",
    icon: "search",
    priceFrom: "Free",
    timeline: "Engineer's report from $450",
    projectCategories: [],
    leadsWith: "inspect",
    problemId: "cracks",
    highlights: [
      "Elevation map of the whole floor",
      "Photos of every crack we find",
      "A written verdict, even when it's “nothing”",
      "Engineer's report for real estate deals",
    ],
    includes: [
      {
        title: "Elevation map",
        body: "Dozens of readings across the floor, drawn as a map so you can see the shape of any movement.",
      },
      {
        title: "Inside & outside",
        body: "Brick, drywall, doors, windows, slab edges, and the crawl space if you have one.",
      },
      {
        title: "A written answer",
        body: "What we found, whether it needs fixing, and what that would cost. It's yours to keep either way.",
      },
      {
        title: "Engineer's report",
        body: "For a sale or a warranty transfer, a licensed engineer reviews the data and signs a report.",
      },
    ],
    faqs: [
      {
        q: "Is the inspection really free?",
        a: "Yes. The survey and written findings cost nothing. An engineer's report, which a lender or buyer may want, is extra and we'll tell you the price first.",
      },
      {
        q: "How long does an inspection take?",
        a: "About an hour for most homes, a little longer with a crawl space.",
      },
    ],
  },
  {
    slug: "siding-replacement",
    group: "more",
    title: "Siding Replacement",
    short: "James Hardie® fiber cement, engineered wood or vinyl, installed to spec.",
    blurb:
      "New siding is only as good as what's behind it. We strip to the sheathing, fix any rot we find, wrap and flash every window, then install fiber cement, engineered wood or vinyl exactly as the manufacturer specifies, so the warranty actually holds.",
    image: "/images/siding-crew.jpg",
    icon: "siding",
    priceFrom: "$10.50/sq ft",
    timeline: "4–8 days on site",
    projectCategories: ["Siding"],
    leadsWith: "inspect",
    problemId: "siding",
    highlights: [
      "James Hardie® Elite Preferred standards",
      "Rotted sheathing replaced, not covered",
      "House wrap and window flashing included",
      "30-year non-prorated Hardie warranty",
    ],
    includes: [
      {
        title: "Strip & inspect",
        body: "The old siding comes off and every wall is inspected. Soft sheathing is replaced at a flat per-sheet price we quote up front.",
      },
      {
        title: "Wrap & flash",
        body: "Weather-resistive barrier over the whole house, and every window and door flashed so water that gets behind the siding gets back out.",
      },
      {
        title: "Install to spec",
        body: "Clearances, fastening and joint details exactly as the manufacturer requires. It's what keeps the warranty valid.",
      },
      {
        title: "Trim & paint",
        body: "Corners, trim and soffit finished to match. Factory-painted ColorPlus® or painted on site in your colours.",
      },
    ],
    faqs: [
      {
        q: "Fiber cement or vinyl?",
        a: "Fiber cement handles Texas sun and hail better and won't melt near a grill, but costs more. Vinyl is the budget option and needs no painting. We'll price both on the same measurements.",
      },
      {
        q: "Will my HOA approve it?",
        a: "We prepare the colour and profile submission for you. Most HOAs approve fiber cement readily.",
      },
    ],
  },
  {
    slug: "siding-repair",
    group: "more",
    title: "Siding Repair",
    short: "Rot, hail and woodpecker damage matched and replaced board by board.",
    blurb:
      "Not every wall needs new siding. Rotted boards behind a gutter, hail-cracked panels on one side or a woodpecker's work can be cut out and replaced with matched material, and the cause fixed so it doesn't come back.",
    image: "/images/siding-drill.jpg",
    icon: "wrench",
    priceFrom: "$650",
    timeline: "Most repairs in 1 day",
    projectCategories: ["Siding"],
    leadsWith: "inspect",
    problemId: "siding",
    highlights: [
      "Profile and colour matched",
      "Sheathing checked behind every board",
      "Cause of the rot fixed, too",
      "Insurance photos for hail claims",
    ],
    includes: [
      {
        title: "Find the edge of the damage",
        body: "We open up until we reach sound material, so the repair doesn't stop halfway into a rotten wall.",
      },
      {
        title: "Match",
        body: "Profile, reveal and texture matched from current stock, and paint matched to your weathered colour.",
      },
      {
        title: "Fix the cause",
        body: "Usually a gutter, a missing kick-out flash or sprinklers hitting the wall. We fix that too.",
      },
      {
        title: "Hail documentation",
        body: "If the damage is from hail, we photograph and measure it the way an adjuster needs.",
      },
    ],
    faqs: [
      {
        q: "Can you match discontinued siding?",
        a: "Often from salvage or a close current profile. If we can't match it, we'll suggest re-siding one full wall so the change falls at a corner.",
      },
    ],
  },
  {
    slug: "trim-soffit-fascia",
    group: "more",
    title: "Trim, Soffit & Fascia",
    short: "Rotted trim and fascia replaced in fiber cement or PVC.",
    blurb:
      "Trim and fascia are where water sits longest, so they rot first. We replace them in fiber cement or cellular PVC that won't rot again, vent the soffits properly and paint everything to match.",
    image: "/images/siding-trim.jpg",
    icon: "ruler",
    priceFrom: "$1,200",
    timeline: "1–2 days on site",
    projectCategories: ["Siding"],
    leadsWith: "inspect",
    problemId: "siding",
    highlights: [
      "Fiber cement or cellular PVC trim",
      "Vented soffit panels",
      "Drip edge and gutter reset",
      "Painted to match",
    ],
    includes: [
      {
        title: "Tear-out",
        body: "Rotted boards come off and the rafter tails behind them are checked and repaired.",
      },
      {
        title: "New fascia & trim",
        body: "Fiber cement or PVC, primed on every face and fastened with stainless or coated fasteners.",
      },
      {
        title: "Soffit venting",
        body: "Vented panels sized to your attic so it breathes, which also keeps moisture out of the trim.",
      },
      {
        title: "Gutters reset",
        body: "Gutters come down and go back up on the new fascia, sloped correctly.",
      },
    ],
    faqs: [
      {
        q: "Why did my fascia rot?",
        a: "Usually water from a gutter that overflows or sits behind the drip edge. We fix that at the same time.",
      },
    ],
  },
];

export const reviews: Review[] = [
  {
    id: "marcus",
    role: "Homeowner",
    date: "12 Mar 2026",
    headline: "It came in under their own estimate.",
    quote:
      "They gave us a range on the phone for our crawl space and said $11,900 was the likely number. The written proposal after the inspection was $11,650. I have never had a contractor come in under their own estimate.",
    name: "Marcus Delgado",
    city: "Keller",
    service: "Crawl space encapsulation",
    rating: 5,
    source: "Google",
    figures: [
      { label: "Phone estimate", value: 11900 },
      { label: "Signed proposal", value: 11650 },
    ],
  },
  {
    id: "priya",
    role: "Homeowner",
    date: "28 May 2026",
    headline: "Every door closes again.",
    quote:
      "Our back bedroom door wouldn't latch and the brick had a crack like a staircase. They showed us the elevation map, put in fourteen piers over two days, and every door in the house closes now.",
    name: "Priya Raghunathan",
    city: "Arlington",
    service: "Foundation repair, 14 piers",
    rating: 5,
    source: "Google",
    photo: { src: "/images/project-brick-ranch.jpg", alt: "Brick ranch home in Arlington after foundation repair" },
  },
  {
    id: "angela",
    role: "Homeowner",
    date: "9 Jan 2026",
    headline: "They told me it was cosmetic.",
    quote:
      "I was sure the crack in our garage slab meant foundation failure. The inspector measured the whole house, showed me it hadn't moved, and told me to seal it and watch it. No charge.",
    name: "Angela Moreno",
    city: "Fort Worth",
    service: "Foundation inspection",
    rating: 5,
    source: "Google",
  },
  {
    id: "dale",
    role: "Property manager",
    date: "17 Nov 2025",
    headline: "The only crew that crawled the whole thing.",
    quote:
      "Three companies quoted our duplex. Daybreak was the only one who went under the entire building and came back with photos of every pier. The other two wanted to shim the one room the tenant complained about.",
    name: "Dale Whitaker",
    city: "Arlington",
    service: "Pier & beam re-level, duplex",
    rating: 5,
    source: "Google",
  },
  {
    id: "brett",
    role: "Homeowner",
    date: "3 Apr 2026",
    headline: "The smell was gone in a week.",
    quote:
      "We'd lived with a musty smell for years and thought it was just an old house. They found standing water and 78% humidity under the floor. A week after the encapsulation the smell was gone.",
    name: "Brett Kowalski",
    city: "Aledo",
    service: "Crawl space encapsulation",
    rating: 5,
    source: "Google",
    photo: { src: "/images/project-farmhouse.jpg", alt: "Farmhouse in Aledo with a wraparound porch" },
  },
  {
    id: "tamika",
    role: "Homeowner",
    date: "21 Jun 2026",
    headline: "A photo update every couple of hours.",
    quote:
      "The project manager texted me photos every couple of hours while the old siding was off, including the rotten sheathing they found and replaced. I have never felt that informed about work on my own house.",
    name: "Tamika Ellison",
    city: "Mansfield",
    service: "Fiber cement siding",
    rating: 5,
    source: "Google",
  },
  {
    id: "luis",
    role: "Homeowner",
    date: "2 Aug 2026",
    headline: "They fixed the water, not just the crack.",
    quote:
      "Another company quoted us nine piers. Daybreak said most of our movement was a downspout dumping against one corner. Drains, a root barrier and three piers, and it's held through two summers.",
    name: "Luis Ortega",
    city: "Fort Worth",
    service: "Drainage & root barrier",
    rating: 5,
    source: "Google",
  },
  {
    id: "karen",
    role: "Homeowner",
    date: "19 Jul 2026",
    headline: "The HOA approved it first time.",
    quote:
      "They put the colour and profile packet together for our HOA and it was approved in a week. The Hardie board looks sharp and the crew cleaned up every evening.",
    name: "Karen Whitlock",
    city: "Keller",
    service: "Board-and-batten siding",
    rating: 5,
    source: "Google",
  },
  {
    id: "sam",
    role: "Homeowner",
    date: "6 Jun 2026",
    headline: "Just the boards that needed it.",
    quote:
      "Rot behind the gutters on two walls. They cut out only what was bad, matched our old lap siding and fixed the gutter that caused it. Half what I expected to pay.",
    name: "Sam Adeyemi",
    city: "Colleyville",
    service: "Siding repair",
    rating: 5,
    source: "Google",
  },
  {
    id: "renee",
    role: "Homeowner",
    date: "30 Apr 2026",
    headline: "Honest about what we didn't need.",
    quote:
      "I was ready to pay for a full encapsulation. The inspector said our crawl space was dry and just needed a new vapor barrier and one vent fixed. That honesty is why we called them for our siding.",
    name: "Renee Fowler",
    city: "Arlington",
    service: "Vapor barrier replacement",
    rating: 5,
    source: "Google",
  },
  {
    id: "owen",
    role: "Rental owner",
    date: "11 Feb 2026",
    headline: "Floors level, tenants happy.",
    quote:
      "The kitchen floor in our rental had a dip you could roll a marble down. Two new support posts on footings and a sistered joist, and it's flat. Done in a day with the tenants at home.",
    name: "Owen Brandt",
    city: "Weatherford",
    service: "Crawl space repair",
    rating: 5,
    source: "Google",
  },
  {
    id: "grace",
    role: "Homeowner",
    date: "14 Aug 2026",
    headline: "The whole house looks new.",
    quote:
      "New fiber cement, new trim and new soffits in eight days. The first big storm came through and not a drop got behind it.",
    name: "Grace Liu",
    city: "Grapevine",
    service: "Siding & trim replacement",
    rating: 5,
    source: "Google",
  },
];

export const projects: Project[] = [
  {
    slug: "arlington-brick-ranch-piers",
    title: "Fourteen steel piers under a brick ranch",
    location: "Arlington",
    areaSlug: "arlington",
    category: "Foundation",
    material: "Steel push piers, driven to refusal",
    size: "14 piers",
    specs: [
      { label: "Piers", value: "14" },
      { label: "Lift recovered", value: "1.6 in" },
    ],
    days: 2,
    insurance: false,
    image: { src: "/images/project-brick-ranch.jpg", alt: "Single-story brick ranch home after foundation repair" },
    beforeAfter: {
      before: { src: "/images/foundation-crack-brick.jpg", alt: "Crack running through the mortar of a brick wall", label: "Before" },
      after: { src: "/images/project-brick-ranch.jpg", alt: "Brick ranch home with repointed brick after the lift", label: "After" },
      placeholderNote: "Placeholder pair — different properties. The live build uses the client's matched photos.",
    },
    problem:
      "A stair-step crack through the brick on the back corner, and a bedroom door that wouldn't latch. The survey showed 1.8 inches of drop over 30 feet.",
    solution:
      "Fourteen steel push piers along the back and side beams, driven to refusal at an average of 19 feet, then lifted in stages with the doors checked at each step.",
    result: "1.6 inches recovered. Every door latches, and the brick was repointed to match.",
    reviewId: "priya",
  },
  {
    slug: "aledo-farmhouse-crawl",
    title: "Encapsulating the crawl space under a farmhouse",
    location: "Aledo",
    areaSlug: "aledo",
    category: "Crawl space",
    material: "20-mil liner, sealed vents, 70-pint dehumidifier",
    size: "1,840 sq ft",
    specs: [
      { label: "Crawl space", value: "1,840 sq ft" },
      { label: "Humidity", value: "78% → 52%" },
    ],
    days: 3,
    insurance: false,
    image: { src: "/images/project-farmhouse.jpg", alt: "Blue farmhouse with a wraparound porch" },
    beforeAfter: {
      before: { src: "/images/crawl-space-before.jpg", alt: "Dusty open crawl space with bare ground and exposed pipes", label: "Before" },
      after: { src: "/images/crawl-foam.jpg", alt: "Sealed, insulated space under a house", label: "After" },
      placeholderNote: "Placeholder pair — different properties. The live build uses the client's matched photos.",
    },
    problem:
      "A musty smell upstairs, 78% humidity under the floor and standing water after every heavy rain.",
    solution:
      "A sump pit at the low corner, a 20-mil liner up the walls, vents and rim joists sealed, and a dehumidifier sized to the space.",
    result: "Humidity holding at 52% six months on. The smell is gone.",
    reviewId: "brett",
  },
  {
    slug: "westover-hardie-siding",
    title: "Full fiber cement re-side on a shingle-style home",
    location: "Westover Hills",
    areaSlug: "fort-worth",
    category: "Siding",
    material: "James Hardie® Artisan lap — Arctic White",
    size: "3,840 sq ft of wall",
    specs: [
      { label: "Wall area", value: "3,840 sq ft" },
      { label: "Siding squares", value: "42" },
    ],
    days: 8,
    insurance: false,
    image: { src: "/images/project-colonial.jpg", alt: "White shingle-style home with a dark roof and hydrangeas" },
    problem:
      "Original wood siding with paint failing on every wall, and soft spots under the windows, in a neighborhood where any change needs design review.",
    solution:
      "Stripped to the sheathing, replaced eleven rotted sheets at our flat per-sheet price, flashed every window, and installed Artisan lap in a profile chosen for the review board.",
    result: "Approved on the first submission. Eight days on site, and the final invoice matched the proposal.",
    reviewId: "tamika",
  },
  {
    slug: "fairmount-pier-beam",
    title: "Re-levelling a 1920s pier-and-beam bungalow",
    location: "Fairmount, Fort Worth",
    areaSlug: "fort-worth",
    category: "Pier & beam",
    material: "Concrete piers, steel shims, sistered joists",
    size: "22 piers",
    specs: [
      { label: "Piers replaced", value: "22" },
      { label: "Floor variance", value: "2.5 in → ⅜ in" },
    ],
    days: 2,
    insurance: false,
    image: { src: "/images/project-craftsman.jpg", alt: "Yellow craftsman bungalow with a front porch" },
    problem: "Rotted cedar stumps and crushed shims left the living room floor 2.5 inches out across its width.",
    solution:
      "Replaced 22 cedar stumps with poured concrete piers, reset the beams on steel shims, and sistered six cracked joists.",
    result: "Floors within ⅜ inch across the whole house, with the original oak floors kept.",
  },
  {
    slug: "keller-sagging-floor",
    title: "A sagging kitchen floor fixed from below",
    location: "Keller",
    areaSlug: "keller",
    category: "Crawl space",
    material: "Adjustable steel posts on poured footings",
    size: "6 support posts",
    specs: [
      { label: "Support posts", value: "6" },
      { label: "Joists sistered", value: "4" },
    ],
    days: 1,
    insurance: false,
    image: { src: "/images/crawl-cellar.jpg", alt: "Low space under a house with wooden joists and work lights" },
    problem: "A dip in the kitchen floor where the old block supports had sunk into wet soil.",
    solution:
      "Six adjustable steel posts on new footings under the girder, raised in stages over a week, plus four sistered joists.",
    result: "The floor is flat and firm, and the dishwasher door lines up again.",
    reviewId: "owen",
  },
  {
    slug: "southlake-board-batten",
    title: "Board-and-batten fiber cement on a modern farmhouse",
    location: "Southlake",
    areaSlug: "southlake",
    category: "Siding",
    material: "James Hardie® Reveal panel + battens — Arctic White",
    size: "2,960 sq ft of wall",
    specs: [
      { label: "Wall area", value: "2,960 sq ft" },
      { label: "Siding squares", value: "33" },
    ],
    days: 6,
    insurance: false,
    image: { src: "/images/concrete-driveway-modern.jpg", alt: "Modern white board-and-batten home with black windows" },
    problem: "Engineered wood siding swelling at every bottom edge after only nine years.",
    solution:
      "Removed it, corrected the ground and roof-line clearances that caused the swelling, and installed fiber cement panel and batten.",
    result: "HOA-approved in one round. Proper clearances on every wall this time.",
    reviewId: "karen",
  },
  {
    slug: "tanglewood-oak-drainage",
    title: "Drainage and a root barrier beside a 60-year-old oak",
    location: "Tanglewood, Fort Worth",
    areaSlug: "fort-worth",
    category: "Drainage",
    material: "French drain, 72 ft root barrier, 3 piers",
    size: "72 ft of barrier",
    specs: [
      { label: "Root barrier", value: "72 ft" },
      { label: "Piers", value: "3" },
    ],
    days: 2,
    insurance: false,
    image: { src: "/images/project-brick-oak.jpg", alt: "Two-story brick home under a mature oak tree" },
    problem: "The oak's roots were drying the soil under one corner, and a downspout was soaking the other.",
    solution: "A root barrier along the tree side, a French drain and piped downspouts, and three piers on the corner that had dropped.",
    result: "The house has held level through two summers of monitoring.",
    reviewId: "luis",
  },
  {
    slug: "colleyville-siding-repair",
    title: "Rotted lap siding replaced behind the gutters",
    location: "Colleyville",
    areaSlug: "colleyville",
    category: "Siding",
    material: "Matched lap siding, new kick-out flashing",
    size: "2 walls",
    specs: [
      { label: "Boards replaced", value: "38" },
      { label: "Kick-outs added", value: "2" },
    ],
    days: 1,
    insurance: false,
    image: { src: "/images/siding-green-lap.jpg", alt: "Green lap siding and white windows" },
    problem: "Soft, swollen siding on two walls where the roof meets the wall and water ran behind it.",
    solution: "Cut out only the rotted boards, replaced the wet sheathing, added kick-out flashing and matched the paint.",
    result: "A one-day repair instead of a re-side.",
    reviewId: "sam",
  },
  {
    slug: "mansfield-slab-lift",
    title: "Slab lift after a leaking drain line",
    location: "Mansfield",
    areaSlug: "mansfield",
    category: "Foundation",
    material: "Helical piers + plumbing repair",
    size: "9 piers",
    specs: [
      { label: "Piers", value: "9" },
      { label: "Lift recovered", value: "1.1 in" },
    ],
    days: 3,
    insurance: true,
    image: { src: "/images/project-modern.jpg", alt: "Modern two-story home with white stucco" },
    problem: "A leaking drain line under the slab had washed out the soil beneath the kitchen.",
    solution: "A plumbing test found the leak; the plumber repaired it, then we set nine helical piers and lifted the settled section.",
    result: "1.1 inches recovered, and the insurer covered the plumbing-related damage.",
  },
];

/** Order and mix of the horizontal proof rail. */
export const proof: ProofItem[] = [
  { kind: "project", slug: "arlington-brick-ranch-piers" },
  { kind: "figures", reviewId: "marcus" },
  { kind: "project", slug: "westover-hardie-siding" },
  { kind: "review", id: "angela" },
  { kind: "project", slug: "aledo-farmhouse-crawl" },
  { kind: "project", slug: "southlake-board-batten" },
  { kind: "review", id: "dale" },
  { kind: "project", slug: "fairmount-pier-beam" },
  { kind: "project", slug: "tanglewood-oak-drainage" },
];

export const problems: Problem[] = [
  {
    id: "cracks",
    label: "I see cracks in my walls or brick",
    image: { src: "/images/foundation-crack-block.jpg", alt: "A wide crack running down through a block wall" },
    heading: "Not every crack means foundation trouble.",
    causes: [
      { title: "Stair-step cracks in brick", body: "The classic sign of one corner settling as the clay under it dries out." },
      { title: "Diagonal drywall cracks", body: "Running up from the corners of doors and windows as the frame racks." },
      { title: "Doors and windows that stick", body: "Often the first thing people notice, before any crack." },
      { title: "Gaps at trim and baseboards", body: "Where the wall has moved away from the floor or the ceiling." },
      { title: "Hairline slab cracks", body: "Usually just shrinkage, and nothing to worry about on their own." },
    ],
    firstStep:
      "A free elevation survey: we measure how far each part of the floor has moved and show you the map. If it's cosmetic, you'll hear that in writing.",
    expectation: "Most pier jobs take two to three days, from $1,350 a pier.",
    primary: { label: "Check my crack", href: `${demoBase}/crack-checker` },
    secondary: { label: "Book a free inspection", href: `${demoBase}/book?problem=cracks` },
  },
  {
    id: "floors",
    label: "My floors sag or slope",
    image: { src: "/images/crawl-cellar.jpg", alt: "Wooden joists and supports in the space under a house" },
    heading: "Sagging floors usually start underneath.",
    causes: [
      { title: "Crushed or shifted shims", body: "Wood shims compress over the years and the beam drops with them." },
      { title: "Sunken supports", body: "Piers and posts sitting on wet soil instead of real footings." },
      { title: "Rotted sill or joists", body: "Wood that's been damp for years loses its strength." },
      { title: "Overspanned joists", body: "Joists too small for the distance they cover, so the floor bounces." },
    ],
    firstStep:
      "We crawl the whole space, photograph every support and measure the floor, then tell you exactly which parts are failing.",
    expectation: "Most sagging-floor repairs are done in a day or two, from $1,950.",
    primary: { label: "Book a crawl space inspection", href: `${demoBase}/book?problem=floors` },
    secondary: { label: "See pier & beam repair", href: `${demoBase}/services/pier-and-beam` },
  },
  {
    id: "musty",
    label: "My crawl space is damp or smells musty",
    image: { src: "/images/crawl-mold.jpg", alt: "Dark moisture streaks running down a surface" },
    heading: "The smell upstairs is coming from below.",
    causes: [
      { title: "Open vents", body: "In summer, vents pull humid air under the house, where it condenses." },
      { title: "Bare dirt or torn plastic", body: "The ground itself gives off moisture all year." },
      { title: "Standing water", body: "Poor drainage outside lets water pool underneath after rain." },
      { title: "Mold on joists", body: "Humidity above about 70% for long enough, and it grows." },
      { title: "Sweating ductwork", body: "Cold ducts in humid air drip onto the insulation and the ground." },
    ],
    firstStep:
      "We measure the humidity and wood moisture under your floor, photograph what we find, and tell you whether you need a vapor barrier or full encapsulation.",
    expectation: "Most encapsulations take two to three days, from $6,800.",
    primary: { label: "Book a crawl space inspection", href: `${demoBase}/book?problem=musty` },
    secondary: { label: "See encapsulation", href: `${demoBase}/services/crawl-space-encapsulation` },
  },
  {
    id: "water",
    label: "Water pools around my foundation",
    image: { src: "/images/foundation-excavation.jpg", alt: "A small excavator digging a drainage trench beside a house" },
    heading: "Water is what moves a North Texas slab.",
    causes: [
      { title: "Short downspouts", body: "Dumping a whole roof's water right at the slab." },
      { title: "Grading that falls toward the house", body: "Often from settled soil or a new bed or patio." },
      { title: "Sprinklers", body: "Soaking one side of the house and not the others." },
      { title: "Large trees nearby", body: "Drawing moisture out of the soil under one corner in summer." },
    ],
    firstStep:
      "We watch where the water actually goes, then design drains, downspouts and grading so the soil around the house stays evenly moist.",
    expectation: "Most drainage work takes a day or two, from $1,200.",
    primary: { label: "Book a drainage assessment", href: `${demoBase}/book?problem=water` },
    secondary: { label: "See drainage work", href: `${demoBase}/services/drainage` },
  },
  {
    id: "siding",
    label: "My siding is rotting or damaged",
    image: { src: "/images/siding-porch-install.jpg", alt: "A worker fitting siding and flashing on a two-story home" },
    heading: "Rot behind siding starts where water gets in.",
    causes: [
      { title: "Missing kick-out flashing", body: "Where a roof edge meets a wall, water runs straight behind the siding." },
      { title: "Too close to the ground or roof", body: "Siding without its required clearances wicks up water." },
      { title: "Failed paint and caulk", body: "Wood and fiber cement need both to keep water out." },
      { title: "Hail and impact damage", body: "Cracked or dented panels let water behind them." },
    ],
    firstStep:
      "We probe the damaged area, check the sheathing behind it and tell you whether a repair will do or the wall needs re-siding.",
    expectation: "Most repairs are done in a day; a full re-side takes four to eight.",
    primary: { label: "Get a siding quote", href: `${demoBase}/book?problem=siding` },
    secondary: { label: "See siding replacement", href: `${demoBase}/services/siding-replacement` },
  },
];

export const comparison: Comparison = {
  usual: {
    label: "How it usually goes",
    steps: [
      { label: "Call a foundation company" },
      { label: "Wait for a callback", wait: true },
      { label: "Schedule a visit" },
      { label: "Wait for the visit", wait: true },
      { label: "Sit through a sales pitch", wait: true },
      { label: "Chase them for a price" },
    ],
  },
  ours: {
    label: "With Daybreak",
    steps: [
      "Check your crack online in 30 seconds",
      "Book a free inspection in two minutes",
      "Pick an inspection time",
      "Confirmed by text",
      "An elevation map and a fixed, written price",
      "We follow up, you don't",
    ],
    fastSteps: 2,
    fastLabel: "Online, before anyone visits",
    note: "You know how serious it is before anyone knocks.",
  },
};

export const processSteps: ProcessStep[] = [
  {
    title: "Tell us",
    body: "Check your crack online or call. Tell us what you're seeing, and pick a time that suits you.",
    detail: "Online, ~2 minutes",
  },
  {
    title: "Inspect",
    body: "A specialist measures the floor, checks the crawl space or the walls, and photographs everything. You get it in writing either way.",
    detail: "On site, ~1 hour",
  },
  {
    title: "Fix",
    body: "A fixed written price, a start date and the plan. Our own crews do the work, and most jobs take one to three days.",
    detail: "1–3 days on site",
  },
];

export const guarantees: Guarantee[] = [
  {
    title: "Lifetime pier warranty",
    icon: "shield",
    body: "Every pier we install is warrantied for the life of the house, and the warranty transfers once if you sell.",
  },
  {
    title: "Manufacturer warranties registered",
    icon: "badge",
    body: "We register the 30-year James Hardie® warranty and the 25-year crawl space liner warranty for you.",
  },
  {
    title: "The written price is the price",
    icon: "document",
    body: "A fixed number of piers at a fixed price, sheathing at a flat rate per sheet. Quoted before we start.",
  },
  {
    title: "Your yard, put back",
    icon: "leaf",
    body: "Every hole backfilled and compacted, beds replanted and sod relaid before we leave.",
  },
  {
    title: "Our own crews",
    icon: "users",
    body: "W-2 employees on our workers' comp policy and $2M liability cover. No subcontracted labor on your home.",
  },
  {
    title: "An honest verdict",
    icon: "check",
    body: "If your crack is cosmetic or your crawl space is dry, you'll hear that in writing — not a pitch.",
  },
];

export const faqs: Faq[] = [
  {
    q: "Is my crack a foundation problem?",
    a: "Maybe not. Hairline cracks in a slab or a straight vertical crack in drywall are often just shrinkage. Stair-step cracks in brick, doors that stick and gaps at trim are more likely to mean movement. Try the crack checker for a quick read, then let us measure it: the inspection is free.",
  },
  {
    q: "Do you do more than foundation repair?",
    a: "Yes. The same crews handle crawl space encapsulation and repair, drainage, and siding, trim and fascia, all with a fixed, written price and our own warranty.",
  },
  {
    q: "How much does foundation repair cost in Fort Worth?",
    a: "Most jobs fall between $5,000 and $15,000, driven by how many piers the house needs. Piers run about $1,350 to $1,750 each installed. The elevation survey tells us the number, and it's fixed in writing before we start.",
  },
  {
    q: "Should my crawl space be vented or sealed?",
    a: "In North Texas humidity, sealed. Open vents pull damp summer air under the house, where it condenses. A sealed, encapsulated crawl space with a dehumidifier stays dry year-round.",
  },
  {
    q: "What siding holds up best in Texas?",
    a: "Fiber cement handles sun, hail and heat better than vinyl and won't rot like wood. Engineered wood is a good middle option if it's installed with the right clearances. We'll price all three on the same measurements.",
  },
  {
    q: "Do I need a structural engineer?",
    a: "Not for every repair. For a real estate sale, a warranty transfer or a complex repair, a licensed engineer reviews our survey and signs off the plan, and we arrange it.",
  },
  {
    q: "Do you use subcontractors?",
    a: "No. Every installer on your job is a W-2 Daybreak employee and carries our workers' comp coverage.",
  },
  {
    q: "Can I finance a repair?",
    a: "Yes. We offer 12 months at 0% interest, and longer terms from 5.99% APR through our lending partners. Checking your rate takes about two minutes and doesn't affect your credit.",
  },
];

/**
 * City centres, plotted on the service-area map. `page: true` areas get a
 * route under /areas — only the ones with a specific local note, so the site
 * never publishes two dozen find-and-replace city pages.
 */
export const areas: Area[] = [
  {
    slug: "fort-worth",
    city: "Fort Worth",
    county: "Tarrant",
    lat: 32.7555,
    lng: -97.3308,
    page: true,
    leadTime: "Next business day",
    note: "Our yard is on Meacham Blvd, so Fort Worth is where the trucks start every morning. Fairmount, Ryan Place and Arlington Heights are full of pier-and-beam homes from the 1920s, and we've crawled under hundreds of them.",
  },
  {
    slug: "arlington",
    city: "Arlington",
    county: "Tarrant",
    lat: 32.7357,
    lng: -97.1081,
    page: true,
    leadTime: "Within 2 days",
    note: "Much of Arlington was built on slabs in the 1970s and 80s, on some of the most expansive clay in the Metroplex. Stair-step cracks in brick are the most common call we get here.",
  },
  {
    slug: "keller",
    city: "Keller",
    county: "Tarrant",
    lat: 32.9346,
    lng: -97.2292,
    page: true,
    leadTime: "Within 2 days",
    note: "Most Keller neighborhoods have HOA rules on siding colour and profile. We prepare and submit the review packet for you, so approval isn't what holds up your start date.",
  },
  {
    slug: "southlake",
    city: "Southlake",
    county: "Tarrant",
    lat: 32.9412,
    lng: -97.1342,
    page: true,
    leadTime: "Within 2 days",
    note: "Southlake's larger homes often have long runs of engineered wood siding installed without the clearances it needs. We see swelling at the bottom edges more here than anywhere else.",
  },
  {
    slug: "denton",
    city: "Denton",
    county: "Denton",
    lat: 33.2148,
    lng: -97.1331,
    page: true,
    leadTime: "Within 3 days",
    note: "Denton sits on the northern edge of our area. Its older homes near the square are pier-and-beam, and the newer ones to the south are slabs on clay, so we see both kinds of foundation work here.",
  },
  {
    slug: "weatherford",
    city: "Weatherford",
    county: "Parker",
    lat: 32.7593,
    lng: -97.7973,
    page: true,
    leadTime: "Within 3 days",
    note: "Out west in Parker County, more homes sit on acreage with crawl spaces, and more of our work is encapsulation and drainage that has to carry water a long way from the house.",
  },
  { slug: "aledo", city: "Aledo", county: "Parker", lat: 32.696, lng: -97.6022, page: false, leadTime: "Within 3 days" },
  { slug: "willow-park", city: "Willow Park", county: "Parker", lat: 32.7626, lng: -97.6506, page: false, leadTime: "Within 3 days" },
  { slug: "grapevine", city: "Grapevine", county: "Tarrant", lat: 32.9343, lng: -97.0781, page: false, leadTime: "Within 2 days" },
  { slug: "colleyville", city: "Colleyville", county: "Tarrant", lat: 32.881, lng: -97.155, page: false, leadTime: "Within 2 days" },
  { slug: "mansfield", city: "Mansfield", county: "Tarrant", lat: 32.5632, lng: -97.1417, page: false, leadTime: "Within 2 days" },
  { slug: "bedford", city: "Bedford", county: "Tarrant", lat: 32.844, lng: -97.1431, page: false, leadTime: "Within 2 days" },
  { slug: "euless", city: "Euless", county: "Tarrant", lat: 32.8371, lng: -97.082, page: false, leadTime: "Within 2 days" },
  { slug: "north-richland-hills", city: "North Richland Hills", county: "Tarrant", lat: 32.8343, lng: -97.2289, page: false, leadTime: "Next business day" },
  { slug: "haslet", city: "Haslet", county: "Tarrant", lat: 32.9746, lng: -97.3478, page: false, leadTime: "Next business day" },
  { slug: "saginaw", city: "Saginaw", county: "Tarrant", lat: 32.8601, lng: -97.3639, page: false, leadTime: "Next business day" },
  { slug: "crowley", city: "Crowley", county: "Tarrant", lat: 32.579, lng: -97.3625, page: false, leadTime: "Within 2 days" },
  { slug: "benbrook", city: "Benbrook", county: "Tarrant", lat: 32.6732, lng: -97.4606, page: false, leadTime: "Next business day" },
  { slug: "flower-mound", city: "Flower Mound", county: "Denton", lat: 33.0146, lng: -97.097, page: false, leadTime: "Within 3 days" },
  { slug: "lewisville", city: "Lewisville", county: "Denton", lat: 33.0462, lng: -96.9942, page: false, leadTime: "Within 3 days" },
  { slug: "argyle", city: "Argyle", county: "Denton", lat: 33.1212, lng: -97.1834, page: false, leadTime: "Within 3 days" },
  { slug: "burleson", city: "Burleson", county: "Johnson", lat: 32.5421, lng: -97.3208, page: false, leadTime: "Within 2 days" },
  { slug: "cleburne", city: "Cleburne", county: "Johnson", lat: 32.3476, lng: -97.3867, page: false, leadTime: "Within 3 days" },
  { slug: "grand-prairie", city: "Grand Prairie", county: "Dallas", lat: 32.746, lng: -96.9978, page: false, leadTime: "Within 2 days" },
];

export const team = [
  {
    name: "Ray Alvarado",
    role: "Founder & President",
    initials: "RA",
    since: 2004,
    bio: "Started Daybreak with one truck and a hydraulic pump after eleven years driving piers for someone else. Still does the elevation survey on the houses he thinks are tricky.",
  },
  {
    name: "Dana Whitfield",
    role: "Engineering Coordinator",
    initials: "DW",
    since: 2011,
    bio: "Works between our crews and the engineer of record, so every repair plan is signed off and every pier log ends up in the right warranty file.",
  },
  {
    name: "Miguel Santos",
    role: "Production Manager",
    initials: "MS",
    since: 2008,
    bio: "Runs six in-house crews across foundation, crawl space and siding. If your job starts at 7 AM, it's because Miguel had the trailer loaded the night before.",
  },
  {
    name: "Jenna Park",
    role: "Siding Estimator",
    initials: "JP",
    since: 2016,
    bio: "Measures and prices every siding job, and puts together the HOA packets that get them approved the first time.",
  },
];

/* ---------------------------------------------------------------- lookups -- */

export const reviewById = (id: string) => reviews.find((r) => r.id === id);
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
