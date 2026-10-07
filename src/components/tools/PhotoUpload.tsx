/**
 * Photos of the problem, as a step in the estimate. On a client's live site
 * homeowners attach them here and they travel with the lead, so the
 * contractor sees the crack before the visit. This is the demo, so the
 * upload is shown but switched off, and says so.
 *
 * `full` is the box in the details step; `inline` is the small row under a
 * repair the homeowner has added.
 */
export function PhotoUpload({ variant }: { variant: "full" | "inline" }) {
  const camera = (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.25" />
    </svg>
  );
  const demo = <span className="mono-label bg-[#fff4d6] px-1.5 py-0.5 text-[10px] text-[#8a5a00]">Off in this demo</span>;

  if (variant === "inline") {
    return (
      <div className="mt-2.5 border-l-2 border-[#e5a50a] bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-1.5 text-[12.5px] text-muted">
            {camera}
            Add a photo of this problem
          </button>
          {demo}
        </div>
        <p className="mt-1 text-[12px] leading-snug text-muted">
          On your live site, customers can attach a photo here, and it&rsquo;s sent to you with their estimate.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mono-label flex items-center gap-2 text-[11.5px]">
        Photos of the problem <span className="text-muted">(optional)</span>
      </p>
      <div
        aria-disabled
        className="mt-1.5 flex cursor-not-allowed flex-col items-center gap-1 border border-dashed border-fg/25 bg-card px-4 py-4 text-center"
      >
        <span className="flex items-center gap-2 text-[14px] text-muted">
          {camera}
          Add up to 5 photos
        </span>
        {demo}
      </div>
      <p className="mt-1.5 text-[12.5px] leading-snug text-muted">
        On your live site, homeowners add photos here and they arrive with the lead, so you see the problem before the
        visit. Switched off in this demo.
      </p>
    </div>
  );
}
