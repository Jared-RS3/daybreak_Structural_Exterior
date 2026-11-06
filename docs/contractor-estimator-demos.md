# Contractor estimator demos

`/estimator` remains the live Daybreak estimator. `/demo/homespec` is an independent, unofficial concept. It is not a HomeSpec service, does not use HomeSpec-approved prices, and cannot send a lead or book an appointment.

## Architecture

- `src/lib/contractors/config.ts` contains the typed contractor shape, Daybreak defaults, HomeSpec settings, and the allowlisted demo registry. Each demo has its own catalog, visible symptoms, house hotspots, questions, measurement limits, pricing guidance, copy, service-area policy, feature flags, and notification flags.
- `src/components/tools/RepairEstimator.tsx` is the existing shared house and concern-selection engine. With no config, its Daybreak form, calculation, photo UI, and server delivery remain as before. A demo config uses the same visual and selection controls but switches to the local qualification flow.
- `src/lib/contractors/assessment.ts` validates selections and answers, handles conditional questions, and reuses `priceEstimate` for approved *illustrative* lines. Uncertain and structural work receives an inspection-required result. Mixed projects show a partial range only for the included lines.
- `src/components/tools/ContractorDemoFlow.tsx` handles questions, results, fictional sample details, the example lead, and an illustrative inspection action in browser memory. It has no fetch, storage, or analytics calls.
- `src/lib/contractors/demo-pdf.ts` generates the marked sample PDF in the browser. It has no delivery endpoint. The operational `/api/tool-lead` endpoint also rejects requests from demo pages as a defense in depth measure.
- `src/app/(marketing)/demo/[slug]/page.tsx` resolves only registered demos. Unknown slugs return 404. Demo pages use `noindex`, are absent from public navigation and the sitemap, and do not show the live tool launcher.

## HomeSpec scope

HomeSpec's [official home page](https://www.basementfix.com/) and [Ypsilanti service page](https://www.basementfix.com/ypsilanti-mi.html) list basement waterproofing, foundation repair, crawl space repair and encapsulation, concrete leveling, and concrete repair. They describe free inspections and estimates, and service beyond Ypsilanti across Southeast Michigan. The demo includes those concerns and excludes siding and general framing. Crawl space support remains represented. ZIP coverage is always marked as requiring confirmation.

The only numerical guidance uses the existing Daybreak sample catalog for simple concrete leveling or joint sealing quantities. It is visibly identified as illustrative and independent. Structural concerns, basement and crawl space work, and settled slabs with open joints require an inspection. HomeSpec rates have not been supplied or inferred.

## Add another prospect

1. Confirm the contractor's services and geography from official sources.
2. Add a `ContractorEstimatorConfig` entry with a unique slug and company details. Select relevant existing catalog items, rewrite homeowner-facing symptoms and hotspot copy, and add concise questions.
3. Set `mode: "demo"`, `serviceArea.zipPolicy: "confirm"`, and all operational notification flags to `false`. Keep photo uploads and analytics disabled for the demo flow.
4. Explicitly mark which item IDs may use illustrative Daybreak sample guidance. Leave uncertain work as inspection-required. Supply the disclaimer, fictional lead labels, and PDF watermark.
5. Add the config to the `demos` allowlist. The shared `/demo/[slug]` route then renders it; no separate estimator component or repository is needed.
6. Run the unit tests, lint, TypeScript and production build. Verify the full journey in a browser at desktop and mobile widths, the unknown-slug 404, noindex, sitemap exclusion, and zero operational requests.

Future production contractors need a separately reviewed configuration, approved prices, integrations, consent and tenant isolation. This demo registry does not turn on those features.

## Review and release

Work is isolated in the `feat/homespec-estimator-demo` worktree. Review its diff, run the checks above, and inspect the local `/demo/homespec` route. After approval, open a pull request from the reviewed branch, merge it through the normal process, deploy, and verify the live route. This work has not been pushed, merged, or deployed.
