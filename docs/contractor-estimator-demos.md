# Southeast Crawlspace Consulting estimator demo

This is a client branch (`feat/southeast-crawlspace-demo`). It is never merged into `main`. It deploys a concept site for Southeast Crawlspace Consulting (SECC, Tucker GA, southeastcrawlspaceconsulting.com): Daybreak's house estimator, dressed as a page on their site.

## What it is

- **Page** (`src/app/demo/southeast/page.tsx`, frame in `src/components/demo/SoutheastShell.tsx`): outside the `(marketing)` group, so there's no Daybreak header, footer or tool launcher. It follows their site: the "Protect Your Home From Below" bar, the black Tucker address bar, a white header with the logo, "Call us now!", the blue phone number and "Request an Assessment", and a black uppercase nav. Below that come blue uppercase section labels over Heebo headings (their own face), white cards on light grey, square uppercase buttons, the blue contact band and a dark footer with a blue strip. A slim ribbon at the top says it's a Daybreak concept.
- **Front door** (`next.config.ts`): `/` and Daybreak's sales pages redirect (307) to `/demo/southeast`. The legal pages stay reachable.
- **Estimator** (`src/components/demo/SoutheastEstimator.tsx`): the same flow as `RepairEstimator`, with the same cut-away photographs and hotspot positions. The areas are crawl space, floor support, foundation and basement.
- **Content** (`src/lib/demos/southeast.ts`): SECC's services in their own terms. That covers encapsulation, vapor barriers, moisture control, cleanouts, drainage and French drains, and "adjustable floor jacks on engineered footings". It also covers foundation and crack repairs and basement waterproofing. Three of these aren't in Daybreak's catalog, so they're added to `lib/estimator.ts` as `extraItems`: crawl space cleanout, vapor barrier and French drain. The server prices them like any other item, but they belong to no category, so `/estimator` never lists them. Prices are sample figures, not SECC's, and the page says so.
- **Lead path**: the live one. The form posts to `/api/tool-lead` with `brand: "southeast"`, with the same signed token, honeypot, consent, Turnstile and rate limits as `ToolLeadForm`. The server checks the picks, accepting only SECC's services, refusing link-like names, and refusing the extras for any other brand.
  - It re-prices the picks and saves the row to Airtable "Homeowner Leads". The reference starts `SE-`, the Summary starts "Southeast Crawlspace Consulting demo", and Page is `/demo/southeast`.
  - It emails the homeowner (`lib/server/southeast-email.ts`, sender name "Southeast Crawlspace Estimates (Daybreak demo)").
  - It attaches the PDF to the row (`lib/demos/southeast-pdf.ts`, logo embedded as base64) and returns it for download.
  - No extra env is needed: it uses the same `AIRTABLE_*`, `RESEND_API_KEY` and `EMAIL_FROM` as the live tool.
- **Privacy** (`/demo/southeast/privacy`, `src/components/demo/DemoPrivacyNotice.tsx`): who runs the demo (Daybreak, not SECC), what it collects, its processors, retention and rights. It's linked from the consent box and the footer.

## Safeguards

Leads are real: they land in the same Airtable table as Daybreak's own tool, and the homeowner gets a real email. Test with Resend's sink address `delivered@resend.dev`. The page and email say SECC hasn't received the details, and point a real homeowner to SECC's phone number. The page is `noindex`, isn't in the sitemap, and the cookie banner and Google Analytics stay off under `/demo/`.

The logo in `public/demo/southeast/` was cropped from their site, because their server blocks automated downloads. It belongs to SECC, so use it only for this pitch, and swap in the original file for a sharper version.

## Checks

`npm test` covers the content, the extras, the PDF and the email. End to end (2026-11-07): on a production build with the live env, one lead to `delivered@resend.dev` was saved, emailed and attached (ref `SE-261107-765055`). Other services, client-only extras under another brand, link-like names and posts from another site were all refused without writing anything.

## Deploy

Create a Netlify site from this repo with this branch as its production branch, as for `homespec-demo`. Give it the same env vars: `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TOOL_TABLE`, `RESEND_API_KEY`, `EMAIL_FROM` and `LEAD_FORM_SECRET`, plus the Turnstile keys if you turn it on.
