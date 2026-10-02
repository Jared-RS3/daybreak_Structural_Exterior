import { Icon } from "@/components/ui/Icon";
import type { Leak } from "@/lib/daybreak";
import { usd } from "@/lib/quote";
import { cn } from "@/lib/utils";

/* ==========================================================================
   The lost-revenue drawings, in the same square Axion style as SystemScenes.
   Each leak card draws the leak itself (what the contractor's phone or inbox
   looks like when it happens); the live run below them draws the fix. Both
   are illustrations, shown aria-hidden beside text that carries the meaning.
   Names, numbers and times are examples.
   ========================================================================== */

export const BLUE = "bg-[#2f7cf6]";
export const GREEN = "text-[#1d6b3f]";
/** Dark enough to pass AA as small text on white. */
export const RED = "text-[#c4302b]";
export const HIGHLIGHT = "bg-[#fff9e0]";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full bg-white", className)}>{children}</div>;
}

export function Bar({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2.5">
      <span className="mono-label truncate text-[9.5px] text-muted">{label}</span>
      {right}
    </div>
  );
}

/** A text from the contractor's number. */
export function Us({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mr-6 w-fit rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[13px] leading-snug text-fg", className)}>
      {children}
    </p>
  );
}

/** The homeowner's reply. */
export function Them({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("ml-auto w-fit rounded-2xl rounded-br-sm px-3 py-2 text-[13px] leading-snug text-white", BLUE, className)}>
      {children}
    </p>
  );
}

/* ---- Leak 01: calls nobody answered ---- */
function Missed() {
  const calls = [
    ["(817) ••• ••19", "4:52 PM"],
    ["(682) ••• ••07", "2:10 PM"],
    ["(817) ••• ••63", "11:34 AM"],
  ];
  return (
    <Card>
      <Bar label="Recent calls" right={<span className={cn("mono-label shrink-0 whitespace-nowrap text-[9.5px]", RED)}>3 missed</span>} />
      <ul>
        {calls.map(([n, t]) => (
          <li key={n} className="flex items-center gap-2.5 border-b border-rule px-3 py-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center bg-[#fdecec]">
              <Icon name="phone" className={cn("size-3.5", RED)} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block text-[13px]", RED)}>Missed call</span>
              <span className="mono-label block text-[9.5px] text-muted">{n}</span>
            </span>
            <span className="text-[12px] text-muted tabular-nums">{t}</span>
          </li>
        ))}
      </ul>
      <p className="mono-label px-3 py-2 text-[9.5px] text-muted">0 voicemails left</p>
    </Card>
  );
}

/* ---- Leak 02: a web form that waits overnight ---- */
function Slow() {
  return (
    <Card className="px-4 py-3.5">
      <div className="flex gap-3">
        <span className="mono-label w-14 shrink-0 pt-0.5 text-[10px] text-muted tabular-nums">8:43 PM</span>
        <span className="flex-1">
          <span className="mono-label block text-[9.5px] text-muted">Web form</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-fg">“Crack in the basement wall, getting wider.”</span>
        </span>
      </div>
      {/* The overnight gap, drawn to feel long. */}
      <div className="my-2 flex items-stretch gap-3">
        <span className="w-14 shrink-0" />
        <span className="relative flex flex-1 items-center py-5 pl-4">
          <span aria-hidden className="absolute inset-y-0 left-0 border-l-2 border-dashed border-[#c4302b]/50" />
          <span className={cn("mono-label bg-[#fdecec] px-2 py-1 text-[10px]", RED)}>12 hrs 32 min, no reply</span>
        </span>
      </div>
      <div className="flex gap-3">
        <span className="mono-label w-14 shrink-0 pt-0.5 text-[10px] text-muted tabular-nums">9:15 AM</span>
        <span className="flex-1">
          <span className="mono-label block text-[9.5px] text-muted">You call back</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-fg">“We already booked someone, sorry.”</span>
        </span>
      </div>
    </Card>
  );
}

/* ---- Leak 03: estimates nobody chased ---- */
function Unsold() {
  const estimates = [
    ["Ray P.", "6 piers", 14200, "21 days ago"],
    ["Dana R.", "Wall bracing", 12500, "14 days ago"],
    ["Jo W.", "Crawl space", 8900, "9 days ago"],
  ] as const;
  const total = estimates.reduce((sum, e) => sum + e[2], 0);
  return (
    <Card>
      <Bar label="Estimates sent" right={<span className="mono-label text-[9.5px] text-muted">Follow-ups: 0</span>} />
      <ul>
        {estimates.map(([name, job, value, sent]) => (
          <li key={name} className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2.5">
            <span className="min-w-0">
              <span className="block text-[13px] text-fg">
                {name} <span className="text-muted">· {job}</span>
              </span>
              <span className="mono-label block text-[9.5px] text-muted">Sent {sent}</span>
            </span>
            <span className="text-right">
              <span className="block text-[13px] text-fg tabular-nums">{usd(value)}</span>
              <span className={cn("mono-label block text-[9.5px]", RED)}>No reply</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between bg-fg px-3 py-2 text-white">
        <span className="mono-label text-[9.5px] text-white/70">Waiting on a yes</span>
        <span className="font-home text-[17px] leading-none tabular-nums">{usd(total)}</span>
      </div>
    </Card>
  );
}

export const leakScenes: Record<Leak["scene"], React.ReactNode> = {
  missed: <Missed />,
  slow: <Slow />,
  unsold: <Unsold />,
};
