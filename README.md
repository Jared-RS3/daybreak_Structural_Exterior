# Daybreak

Daybreak is a web agency. This app is its site for **foundation repair, crawl
space and siding contractors** — the same design system as the roofing site,
aimed at these three trades. It holds two things:

| Route | What it is |
|---|---|
| `/` | **The agency site.** Sells Daybreak's websites and lead systems to contractors. Real business, real terms — no invented proof. |
| `/work/daybreak-foundation` | **The reference build.** A complete contractor site for *Daybreak Foundation & Exteriors* (foundation and crawl space first, plus siding) with a working crack & symptom checker. The contractor is fictional; it's the portfolio piece the agency site links to. |

Both use one design language, modelled on [Crest](https://crestroofing.framer.website):
a sky-gradient hero with a real house standing in it, Manrope headlines at 500,
pill labels and pill buttons, light-grey rounded card "trays", neutral greys.

```
src/
  app/
    (marketing)/                 the agency site: / + privacy, terms, accessibility
      layout.tsx                 agency header, footer, mobile bar
      page.tsx                   agency homepage
    work/daybreak-foundation/    the contractor reference build
      layout.tsx                 demo ribbon, contractor header/footer, call bar, noindex
      page.tsx                   contractor homepage
      services/[slug]/           9 service pages (generated from content)
      crack-checker/             the crack & symptom checker, full page
      projects/, projects/[slug] case studies
      areas/[slug]/              town pages (only towns with a local note)
      book/                      free-inspection form
    api/growth-audit             free-design form → webhook         ← see PROTOTYPE
  components/
    template/                    the reusable home-services design system
    tools/                       the crack checker, its hero chip, inspection buttons
    daybreak/                    agency-homepage sections
    agency/LegalDoc.tsx          layout for the legal pages
  lib/
    template/types.ts            the content contract every template section renders
    template/schema.ts           JSON-LD builders
    demo-site.ts                 Daybreak Foundation & Exteriors content (the one client file)
    site.ts                      "the active client" — re-exports demo-site
    daybreak.ts, agency.ts       agency content and legal facts
    quote.ts                     money formatting and financing maths
```

## Running

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint    # clean
```

## The template, and a new client

`components/template/*` never contains a client's words. Every section renders
props shaped by `lib/template/types.ts`. To build a site for a real contractor:

1. Copy `lib/demo-site.ts`, replace the content, and point `lib/site.ts` at it.
2. Set `illustrative = false` once every review, rating, count and project is real.
   That flag drives every on-screen "Illustrative" tag, so they all go at once.
3. Set `publishStructuredData = true` to emit GeneralContractor / Service / FAQ
   JSON-LD — only when the business facts are real.
4. Re-brand by overriding the semantic tokens in `siteTheme`
   (`--color-accent`, `--color-sky-1…5`, `--color-surface`… — see `globals.css`).
5. Swap the hero house: any house photographed against clear sky can be cut out
   the same way `home-modern-cutout.webp` was (sky made transparent).

Services carry `group: "specialty" | "more"`, so a foundation company that
also does siding still reads as a foundation company. The homeowner tool is a
slot (`ToolSection` takes the instrument as a prop); here it is the crack &
symptom checker, which runs entirely in the browser and sends nothing.

The roofing site's satellite measurement was deliberately left out: satellite
imagery shows roofs, not foundations, crawl spaces or wall area, so any figure
it produced for these trades would be a guess.

## Honesty rules (unchanged)

- Nothing on the agency site claims a client result Daybreak hasn't produced.
  The proof is the reference build, which a visitor can open and use.
- Everything on the reference build describes a fictional company and is
  labelled so on screen. Never remove the tags while the placeholder content
  stays (FTC 16 CFR Part 465). The demo uses reserved `.example` domains.
- The reference build is `noindex` and excluded from the sitemap.

## Images

`public/images/CREDITS.md` lists the Unsplash (and one public-domain) photos
used for foundation, crawl space and siding. The "Our work" concept homepages
are drawn in code (`components/daybreak/MiniSites.tsx`), not screenshots.

## PROTOTYPE — what is not finished

1. **Lead form destination.** `/api/growth-audit` forwards to
   `DAYBREAK_LEAD_WEBHOOK`; without it, leads are only written to the server
   log. Set it before launch. The success message promises an audit within two
   business days — kept by a person, not code.
2. **Contact placeholders.** `lib/agency.ts` (`email`, `legal.*`) and
   `metadataBase` in `app/layout.tsx` are placeholders.
3. **The demo's inspection form** doesn't submit anywhere by design (it says so).
4. **Crack checker figures.** The severity rules and cost ranges in
   `components/tools/CrackChecker.tsx` are an illustrative rule of thumb. A real
   client's ranges and wording should come from them, and ideally be reviewed by
   their engineer.
5. **Legal pages** still use the previous visual style inside the new header
   and footer.
