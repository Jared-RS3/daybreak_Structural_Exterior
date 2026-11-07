# Contractor estimator demos

`/estimator` is Daybreak's live house estimator. `/demo/homespec` is a concept page for HomeSpec Waterproofing & Foundation Repair (basementfix.com): the same estimator, dressed as a page on their site, to show them what it would look like as theirs.

## What it is

- **Page** (`src/app/demo/homespec/page.tsx`): outside the `(marketing)` group, so no Daybreak header, footer or tool launcher. It follows basementfix.com: their logo, the black "Yes, we serve Metro Detroit" tab, the blue phone number, the dark title band over a blue stripe, heavy headings with a short blue bar, black pill buttons, their trust tiles and a grey footer. Their heading face (Proxima Nova Condensed) is commercial, so Figtree stands in; body text is Arial, as theirs is. A slim ribbon at the top says it's a Daybreak concept.
- **Estimator** (`src/components/demo/HomeSpecEstimator.tsx`): the same flow as `RepairEstimator`, with the same cut-away photographs and hotspot positions. A visitor points at the problem or ticks a symptom, picks a size, enters ZIP, name, phone and email (ZIP first, like HomeSpec's own form) and ticks consent, then sees the ballpark and downloads the PDF.
- **Lead path**: the live one. The form posts to `/api/tool-lead` with `brand: "homespec"`, with the same signed token, honeypot, consent, Turnstile and rate limits as `ToolLeadForm`. The server re-prices the picks (only HomeSpec's services are accepted), saves the row to Airtable "Homeowner Leads" (reference `HS-…`, Summary starts "HomeSpec demo", Page is `/demo/homespec`), emails the homeowner (`lib/server/homespec-email.ts`, sender name "HomeSpec Estimates (Daybreak demo)" on `EMAIL_FROM`'s address), attaches the PDF to the row, and hands the PDF back for download. No extra env: it uses the same `AIRTABLE_*`, `RESEND_API_KEY` and `EMAIL_FROM` as the live tool.
- **Content** (`src/lib/demos/homespec.ts`): HomeSpec's four services in their own terms (Crawl Space Support Jacks, PolyLevel, basement crack repair, sump pumps, wall anchors, pier systems), retold over the shared catalog. Siding and framing are left out. Prices are Daybreak's sample figures from `lib/estimator.ts`, and the page says so.
- **PDF** (`src/lib/demos/homespec-pdf.ts`): a HomeSpec-branded estimate, drawn on the server with pdf-lib.

## Safeguards

Leads from this page are real: they land in the same Airtable table as Daybreak's own tool and the homeowner gets a real email, so test with Resend's sink address `delivered@resend.dev` rather than a stranger's. "Schedule My Free Inspection" confirms on screen only; the lead itself is the request. The page is `noindex`, isn't in the sitemap, and the cookie banner and Google Analytics stay off under `/demo/` (`CookieConsent`). The logo file in `public/demo/homespec/` belongs to HomeSpec; use it only for this pitch.

## Checks

`npm test` covers the content, the PDF and the email. End to end (2026-11-07): production build on port 3217 with the live env, one lead to `delivered@resend.dev` saved, emailed and attached (ref `HS-261107-84E801`); a post from another site, a forged token, missing consent, non-HomeSpec services, an absurd quantity, a bot and a burst from one IP were all refused without writing anything.
