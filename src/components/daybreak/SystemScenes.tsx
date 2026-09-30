import { Icon } from "@/components/ui/Icon";
import { sampleAttribution } from "@/lib/agency";
import { monthlyPayment, usd } from "@/lib/quote";
import { cn } from "@/lib/utils";

/* ==========================================================================
   What each step of the system looks like while it's happening, following
   one fictional homeowner (Sarah, in Keller). Drawn in code, in the agency's
   square Axion style. Illustrations only: the stage that shows them is
   aria-hidden, and the step text beside them carries the meaning.

   "Your Foundation Co." stands in for the client, so a contractor reads every
   panel as their own business.
   ========================================================================== */

const BRAND = "Your Foundation Co.";

/* Her job: one settling side, eight steel piers. The signed price sits inside
   the range the checker's inspection led to, and the financing line is
   computed from it, so the story's numbers agree with each other. */
const PIERS = 8;
const m = { low: 11450, high: 14650 };
const SIGNED = Math.round((m.low + (m.high - m.low) * 0.3) / 100) * 100;
const MONTHLY = Math.round(monthlyPayment(SIGNED, 8.99, 120));

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full max-w-[34rem] bg-white shadow-[0_24px_60px_-36px_rgb(0_0_0/0.45)]", className)}>{children}</div>;
}

function Bar({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
      <span className="mono-label text-[10.5px] text-muted">{label}</span>
      {right}
    </div>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" filled className="size-3 text-[#f2b53a]" />
      ))}
    </span>
  );
}

/* ---- 01 Get found ---- */
export function SceneSearch() {
  const others = [
    { name: "Lone Star Foundation Pros", meta: "4.4 · Foundation repair · 5.8 mi" },
    { name: "A1 Structural", meta: "4.1 · Foundation repair · 7.2 mi" },
  ];
  return (
    <Card>
      <div className="flex items-center gap-3 border-b border-rule px-4 py-3.5">
        <Icon name="target" className="size-4 text-muted" />
        <span className="flex-1 text-[15px] text-fg">foundation repair keller tx</span>
        <span className="mono-label text-[10px] text-muted">Search</span>
      </div>
      {/* A drawn map: street grid, three pins, ours highlighted. */}
      <div className="relative h-40 overflow-hidden bg-[#eef1ec]">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #fff 0 6px, transparent 6px), linear-gradient(0deg, #fff 0 6px, transparent 6px)",
            backgroundSize: "68px 68px, 54px 54px",
          }}
        />
        <div className="absolute inset-y-0 left-[38%] w-3 -skew-x-12 bg-[#fbe7a6]" />
        {[
          ["58%", "30%", true],
          ["22%", "62%", false],
          ["80%", "70%", false],
        ].map(([l, t, ours]) => (
          <span
            key={String(l)}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-full items-center gap-1.5",
              ours ? "z-10" : "",
            )}
            style={{ left: l as string, top: t as string }}
          >
            <Icon name="pin" filled className={cn(ours ? "size-8 text-[#e5484d]" : "size-6 text-[#9aa0a6]")} />
            {ours && <span className="mono-label bg-white px-1.5 py-1 text-[9.5px] text-fg shadow">#1</span>}
          </span>
        ))}
      </div>
      <ul>
        <li className="relative border-b border-rule bg-[#fff9e0] px-4 py-3.5">
          <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-sun" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-home text-[16px] text-fg">{BRAND}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                <span className="text-fg">4.9</span>
                <Stars />
                (212) · Foundation repair · 2.1 mi
              </p>
              <p className="mt-1 text-[12.5px] text-[#1d6b3f]">Open today · Free foundation inspections</p>
            </div>
            <div className="hidden shrink-0 gap-1.5 sm:flex">
              <span className="mono-label border border-rule px-2 py-1.5 text-[9.5px] text-fg">Website</span>
              <span className="mono-label bg-fg px-2 py-1.5 text-[9.5px] text-white">Call</span>
            </div>
          </div>
        </li>
        {others.map((o) => (
          <li key={o.name} className="border-b border-rule px-4 py-3 last:border-0">
            <p className="text-[14px] text-fg/60">{o.name}</p>
            <p className="mt-0.5 text-[12px] text-muted">{o.meta}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---- 02 Give value ---- */
export function SceneEstimate() {
  const answers = [
    ["Where", "Brick, outside wall"],
    ["Looks like", "Stair-step"],
    ["Width", "Pencil-lead wide"],
    ["Also", "Back door sticks"],
  ];
  return (
    <Card>
      <Bar label="yourcompany.example / crack-checker" right={<span className="mono-label text-[10px] text-[#1d6b3f]">● Live tool</span>} />
      <dl className="grid grid-cols-2">
        {answers.map(([k, v], i) => (
          <div key={k} className={cn("border-b border-rule px-4 py-3", i % 2 === 1 && "border-l")}>
            <dt className="mono-label text-[9.5px] text-muted">{k}</dt>
            <dd className="mt-1 text-[14.5px] text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="px-4 py-4">
        <p className="inline-flex items-center gap-2 bg-[#fff4d6] px-3 py-1.5 text-[13.5px] font-medium text-[#8a5a00]">
          <span aria-hidden className="size-2 rounded-full bg-[#e5a50a]" />
          Worth an inspection
        </p>
        <p className="font-home mt-3 text-[17px] leading-[1.35] tracking-[-0.01em] text-fg">
          One corner is likely settling as the clay under it dries out.
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-rule bg-panel px-4 py-3.5">
        <span>
          <span className="mono-label block text-[9.5px] text-muted">If it&rsquo;s settlement · {PIERS} piers</span>
          <span className="font-home text-[22px] tracking-[-0.02em] text-fg tabular-nums">
            {usd(m.low)} – {usd(m.high)}
          </span>
        </span>
        <span className="mono-label bg-fg px-3 py-2.5 text-[10px] text-white">Book inspection</span>
      </div>
    </Card>
  );
}

/* ---- 03 Capture ---- */
export function SceneCapture() {
  const fields = [
    ["Service", "Foundation crack / sticking door"],
    ["Address", "1418 Oak Ridge Dr, Keller"],
    ["Checker result", "Worth an inspection"],
    ["Source", "Google Maps"],
    ["Search", "“foundation repair keller tx”"],
    ["Landing page", "/foundation-repair"],
    ["Device", "iPhone · 11:02 AM"],
  ];
  const stages = ["New", "Contacted", "Inspection", "Estimate", "Won"];
  return (
    <Card>
      <Bar
        label="CRM · Leads"
        right={
          <span className="mono-label flex items-center gap-1.5 bg-sun px-2 py-1 text-[10px] text-fg">
            <Icon name="bolt" className="size-3" /> New lead
          </span>
        }
      />
      <div className="flex items-center gap-3 px-4 pt-4">
        <span className="flex size-10 items-center justify-center bg-panel-2 text-[13px] font-semibold text-fg">SM</span>
        <span>
          <span className="font-home block text-[18px] tracking-[-0.01em] text-fg">Sarah M.</span>
          <span className="block text-[12.5px] text-muted">(817) ••• ••42 · sarah.m@…</span>
        </span>
        <span className="mono-label ml-auto text-[10px] text-muted">Owner: Mike R.</span>
      </div>
      <dl className="mt-4 border-t border-rule">
        {fields.map(([k, v], i) => (
          <div key={k} className={cn("grid grid-cols-[8.5rem_1fr] gap-3 border-b border-rule px-4 py-2", i >= 3 && i <= 5 && "bg-[#fff9e0]")}>
            <dt className="mono-label pt-0.5 text-[9.5px] text-muted">{k}</dt>
            <dd className="text-[13.5px] text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <ol className="flex gap-1 p-4">
        {stages.map((s, i) => (
          <li
            key={s}
            className={cn("mono-label flex-1 py-1.5 text-center text-[9.5px]", i === 0 ? "bg-fg text-white" : "bg-panel text-muted")}
          >
            {s}
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* ---- 04 Respond ---- */
export function SceneRespond() {
  return (
    // Stacked on a phone; on wider screens the phone sits left and the rep's
    // notification and the reply timer sit clear of it on the right.
    <div className="flex w-full max-w-[42rem] flex-col items-center gap-3 sm:relative sm:block sm:h-[33rem]">
      {/* The homeowner's phone */}
      <div className="w-[17rem] overflow-hidden rounded-[2.4rem] border-[7px] border-fg bg-white shadow-[0_30px_70px_-30px_rgb(0_0_0/0.55)] sm:absolute sm:left-4 sm:top-0 sm:w-[20rem]">
        <div className="border-b border-rule px-4 pb-3 pt-3.5 text-center">
          <span className="mx-auto mb-2.5 block h-1.5 w-16 rounded-full bg-fg/80" />
          <span className="text-[14px] font-semibold text-fg">{BRAND}</span>
        </div>
        <div className="space-y-2.5 bg-panel px-3.5 py-5 text-[13.5px] leading-snug sm:text-[15px]">
          <p className="mono-label text-center text-[10px] text-muted">Today 11:02 AM</p>
          <p className="mr-6 rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-fg">
            Hi Sarah, thanks for your inspection request. Mike will call you by 11:30. Reply 1 to pick a time now.
          </p>
          <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#2f7cf6] px-3.5 py-2.5 text-white">1</p>
          <p className="mr-6 rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-fg">
            Great. Tomorrow 9:00 AM or 2:30 PM?
          </p>
          <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#2f7cf6] px-3.5 py-2.5 text-white">9 works 👍</p>
          <p className="mr-6 rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-fg">
            Booked: tomorrow 9:00 AM. See you then!
          </p>
        </div>
      </div>
      {/* The rep's notification */}
      <div className="w-[17rem] bg-white p-4 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.5)] sm:absolute sm:right-0 sm:top-10 sm:w-[17.5rem] sm:p-5">
        <p className="mono-label flex items-center gap-1.5 text-[10.5px] text-muted">
          <Icon name="bolt" className="size-3.5 text-fg" /> To: Mike R. · now
        </p>
        <p className="mt-2 text-[16px] font-medium text-fg">New lead: Sarah M., Keller</p>
        <p className="mt-1 text-[14px] text-muted">Stair-step crack · door sticking · call within 5 min</p>
        <span className="mono-label mt-3 inline-flex bg-fg px-2.5 py-1.5 text-[10px] text-white">Call Sarah</span>
      </div>
      <div className="self-center bg-fg px-5 py-3.5 text-white sm:absolute sm:bottom-14 sm:right-0">
        <p className="mono-label text-[10.5px] text-white/70">First reply</p>
        <p className="font-home text-[34px] leading-none tracking-[-0.02em] tabular-nums">0:03</p>
      </div>
    </div>
  );
}

/* ---- 05 Follow up ---- */
export function SceneFollowUp() {
  const steps = [
    { day: "Day 0", icon: "mail" as const, what: `Written ${PIERS}-pier estimate emailed`, status: "Opened" },
    { day: "Day 2", icon: "message" as const, what: "“Any questions about the estimate, Sarah?”", status: "Delivered" },
    { day: "Day 4", icon: "wallet" as const, what: `Financing options: from ${usd(MONTHLY)}/mo`, status: "Opened" },
    { day: "Day 6", icon: "phone" as const, what: "Reminder to Mike: call Sarah", status: "Queued" },
  ];
  return (
    <Card>
      <Bar label="Follow-up sequence · Sarah M." right={<span className="mono-label text-[10px] text-[#1d6b3f]">● Running</span>} />
      <ol className="relative px-4 py-3">
        <span aria-hidden className="absolute bottom-6 left-[1.9rem] top-6 w-px bg-rule" />
        {steps.map((s, i) => (
          <li key={s.day} className={cn("relative flex items-center gap-3 py-2.5", i === 3 && "opacity-45")}>
            <span className="relative z-10 flex size-7 shrink-0 items-center justify-center bg-panel-2">
              <Icon name={s.icon} className="size-3.5 text-fg" />
            </span>
            <span className="mono-label w-12 shrink-0 text-[10px] text-muted">{s.day}</span>
            <span className="flex-1 text-[13.5px] text-fg">{s.what}</span>
            <span className="mono-label text-[9.5px] text-muted">{s.status}</span>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-3 border-t border-rule bg-[#fff9e0] px-4 py-3.5">
        <span className="flex size-7 shrink-0 items-center justify-center bg-sun">
          <Icon name="check" className="size-4 text-fg" />
        </span>
        <span className="flex-1">
          <span className="block text-[13.5px] text-fg">Sarah replied: “Let’s go ahead.”</span>
          <span className="mono-label text-[9.5px] text-muted">Day 5 · sequence stopped automatically</span>
        </span>
      </div>
    </Card>
  );
}

/* ---- 06 Track revenue ---- */
export function SceneRevenue() {
  const path = ["Google Maps", "Foundation page", "Crack checker", "Text reply", "2 follow-ups", "Signed"];
  const max = Math.max(...sampleAttribution.sources.map((s) => s.leads));
  return (
    <Card>
      <Bar label="Report · jobs by source" right={<span className="mono-label text-[10px] text-muted">{sampleAttribution.period}</span>} />
      <div className="px-4 pt-4">
        <p className="mono-label text-[9.5px] text-muted">Job won · Sarah M., Keller</p>
        <p className="font-home mt-1 text-[34px] leading-none tracking-[-0.03em] text-fg tabular-nums">{usd(SIGNED)}</p>
        <ol className="mt-3 flex flex-wrap items-center gap-1">
          {path.map((p, i) => (
            <li key={p} className="flex items-center gap-1">
              <span className={cn("mono-label px-1.5 py-1 text-[9px]", i === path.length - 1 ? "bg-sun text-fg" : "bg-panel text-fg")}>{p}</span>
              {i < path.length - 1 && <Icon name="chevronRight" className="size-3 text-muted" />}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-4 border-t border-rule px-4 py-3.5">
        <div className="mono-label flex justify-between text-[9.5px] text-muted">
          <span>Source</span>
          <span>Leads · Jobs</span>
        </div>
        <ul className="mt-2 space-y-2">
          {sampleAttribution.sources.map((s) => (
            <li key={s.name} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-[12.5px]">
              <span className={s.name === "Google Maps" ? "font-medium text-fg" : "text-fg/75"}>{s.name}</span>
              <span className="relative h-2 bg-panel">
                <span className="absolute inset-y-0 left-0 bg-fg/25" style={{ width: `${(s.leads / max) * 100}%` }} />
                <span
                  className={cn("absolute inset-y-0 left-0", s.name === "Google Maps" ? "bg-sun" : "bg-fg")}
                  style={{ width: `${(s.jobs / max) * 100}%` }}
                />
              </span>
              <span className="text-right tabular-nums text-muted">
                {s.leads} · <span className="text-fg">{s.jobs}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
