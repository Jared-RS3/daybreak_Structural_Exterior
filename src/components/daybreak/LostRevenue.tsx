import { Icon } from "@/components/ui/Icon";
import type { IndustryStat, Leak } from "@/lib/daybreak";
import { cn } from "@/lib/utils";
import { AxButton, AxHead, AxLabel, AxTag } from "./ax";
import { RED, leakScenes } from "./LeakScenes";

/* ==========================================================================
   Lost revenue: the automations, sold as money the contractor is already
   losing rather than as software. The band under the hero names the problem,
   the section names the three leaks and shows one being fixed live, and the
   before/after section (AxComparison) closes with outcomes and their own
   numbers.
   ========================================================================== */

const pad = (i: number) => String(i + 1).padStart(2, "0");

function Source({ stat, className }: { stat: { source?: string; href?: string }; className?: string }) {
  if (!stat.source || !stat.href) return null;
  return (
    <a
      href={stat.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("mono-label inline-flex max-w-[22rem] items-start gap-1.5 text-[11px] leading-[1.45] text-muted transition-colors hover:text-fg", className)}
    >
      Source: {stat.source}
      <Icon name="arrowUpRight" className="size-3.5" />
    </a>
  );
}

/**
 * The band directly under the hero: the reframe in one line, two industry
 * figures with their sources, and the three leaks, with a jump to the section
 * that shows them. `before` runs first inside the same section (the
 * founder's film on the homepage).
 */
export function LeakBand({
  before,
  quiet,
  loud,
  stats,
  leaks,
  cta,
  href,
}: {
  before?: React.ReactNode;
  quiet: string;
  loud: string;
  stats: IndustryStat[];
  leaks: string[];
  cta: string;
  href: string;
}) {
  return (
    <section aria-labelledby="leak-band-title" className="bg-white pb-20 pt-14 sm:pb-24 sm:pt-20">
      <div className="container-wide">
        {before}
        <div className="flex justify-center border-t border-rule pt-6 lg:justify-start">
          <AxLabel>Lost revenue</AxLabel>
        </div>
        <h2
          id="leak-band-title"
          className="font-home mx-auto mt-10 max-w-5xl text-center text-[clamp(2.2rem,4.6vw,4.2rem)] font-normal leading-[1.04] tracking-[-0.035em] lg:mx-0 lg:mt-14 lg:text-left"
        >
          <span className="text-muted">{quiet}</span> <span className="text-fg">{loud}</span>
        </h2>

        <ul className="mt-12 grid gap-px bg-rule sm:grid-cols-3 lg:mt-16">
          {stats.map((s) => (
            <li key={s.value} className="flex flex-col bg-white py-8 sm:px-6 sm:first:pl-0 lg:px-10">
              <p className="font-home text-[clamp(3.2rem,5.5vw,4.8rem)] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                {s.value}
              </p>
              <p className="mt-4 max-w-xs text-[17px] leading-[1.5] text-fg">{s.label}</p>
              <Source stat={s} className="mt-auto pt-6" />
            </li>
          ))}
          <li className="flex flex-col bg-white py-8 sm:px-6 sm:pr-0 lg:pl-10">
            <p className="font-home text-[clamp(3.2rem,5.5vw,4.8rem)] font-light leading-none tracking-[-0.04em] text-fg">
              {leaks.length}
            </p>
            <p className="mt-4 text-[17px] leading-[1.5] text-fg">leaks we fix:</p>
            <ul className="mt-2 space-y-1.5">
              {leaks.map((l) => (
                <li key={l} className="flex items-center gap-2 text-[17px] text-fg">
                  <Icon name="drop" filled className={cn("size-3.5", RED)} />
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <AxButton href={href}>
                {cta}
                <Icon name="arrowRight" className="size-4" />
              </AxButton>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

/**
 * The leaks section. With `leaks`, the three leaks as cards — the leak drawn
 * as it happens, then what Daybreak sets running instead, then one figure;
 * subgrid lines the cards' rows up on desktop, and on phones they swipe. With
 * `run`, the live run. The homepage shows the run; /how-it-works the cards.
 */
export function LostRevenue({
  label,
  title,
  lede,
  leaks,
  run,
  runHead,
  action,
  id = "automations",
}: {
  id?: string;
  label: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  leaks?: Leak[];
  run?: React.ReactNode;
  /** Its own heading for the run, when it follows the cards in one section. */
  runHead?: { label: string; title: React.ReactNode; lede: React.ReactNode };
  /** A link on from the section, under everything else. */
  action?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead id={`${id}-title`} label={label} title={title} lede={lede} />

        {leaks && <LeakCards leaks={leaks} />}

        {runHead && (
          <div className="mt-20 border-t border-rule pt-6 lg:mt-28">
            <AxLabel>{runHead.label}</AxLabel>
            <h3 className="font-home mt-10 text-[clamp(2rem,3.6vw,3.2rem)] font-normal leading-[1.06] tracking-[-0.03em] text-fg lg:mt-14">
              {runHead.title}
            </h3>
            <p className="mt-4 max-w-xl text-[17px] leading-[1.6] text-muted">{runHead.lede}</p>
          </div>
        )}
        {run && <div className={runHead ? "mt-10" : leaks ? "mt-20 lg:mt-28" : "mt-14 lg:mt-16"}>{run}</div>}
        {action && <div className="mt-10 lg:mt-12">{action}</div>}
      </div>
    </section>
  );
}

function LeakCards({ leaks }: { leaks: Leak[] }) {
  return (
    <>
      <ol
        aria-label="Three revenue leaks"
        className="-mx-5 mt-14 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-5 px-5 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-y-0 lg:overflow-visible lg:px-0"
      >
        {leaks.map((l, i) => (
          <li
            key={l.name}
            className="flex w-[86%] shrink-0 snap-start flex-col bg-panel sm:w-[60%] lg:row-span-4 lg:grid lg:w-auto lg:grid-rows-subgrid"
          >
            <div className="p-6 sm:p-7">
              <p className={cn("mono-label flex items-center gap-2 text-[12px]", RED)}>
                <Icon name="drop" filled className="size-3.5" />
                Leak {pad(i)}
              </p>
              <h3 className="font-home mt-6 text-[clamp(1.9rem,2.6vw,2.4rem)] font-normal leading-none tracking-[-0.03em] text-fg">
                {l.name}
              </h3>
              <p className="mt-3 text-[16.5px] leading-[1.55] text-muted">{l.problem}</p>
            </div>

            <div aria-hidden className="flex items-center bg-panel-2 p-5 sm:p-6">
              {leakScenes[l.scene]}
            </div>

            <div className="p-6 sm:p-7">
              <p className="mono-label flex items-center gap-2 text-[12px] text-fg">
                <span aria-hidden className="size-1.5 bg-sun" />
                Daybreak fixes it
              </p>
              <ol className="mt-3.5 flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {l.flow.map((f, j) => {
                  const end = j === l.flow.length - 1;
                  return (
                    <li key={f} className="flex items-center gap-1.5">
                      <span className={cn("mono-label px-2 py-1.5 text-[11px]", end ? "bg-sun text-fg" : "bg-white text-fg")}>{f}</span>
                      {!end && <Icon name="arrowRight" className="size-3.5 text-muted" />}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-auto border-t border-rule p-6 sm:p-7 lg:mt-0">
              <p className="font-home text-[2.6rem] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                {l.stat.value}
              </p>
              <p className="mt-2.5 text-[15.5px] leading-[1.5] text-fg">{l.stat.label}</p>
              <Source stat={l.stat} className="mt-3" />
            </div>
          </li>
        ))}
      </ol>
      <p className="mono-label mt-4 text-[12px] text-muted lg:hidden">Swipe for all three</p>
    </>
  );
}

/** What the contractor gets, as outcomes, with the automations behind each in small type. */
export function Outcomes({ items }: { items: { title: string; how: string[] }[] }) {
  return (
    <div className="mt-20 lg:mt-28">
      <AxLabel>What you get</AxLabel>
      <ul className="mt-8 border-t border-fg">
        {items.map((o, i) => (
          <li key={o.title} className="grid gap-3 border-b border-rule py-6 sm:grid-cols-12 sm:items-center sm:gap-8">
            <span className="mono-label hidden text-[12.5px] text-muted sm:col-span-1 sm:block">{pad(i)}</span>
            <h3 className="font-home text-[clamp(1.75rem,3.2vw,2.75rem)] font-normal leading-[1.05] tracking-[-0.03em] text-fg sm:col-span-6">
              {o.title}
            </h3>
            <ul className="flex flex-wrap gap-1.5 sm:col-span-5 sm:justify-end">
              {o.how.map((h) => (
                <li key={h}>
                  <AxTag tone="white" className="text-[11.5px]">
                    {h}
                  </AxTag>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Works with the tools you already use", only once there's something true to list. */
export function Integrations({ tools }: { tools: string[] }) {
  if (!tools.length) return null;
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <p className="text-[17px] text-fg">Works with the tools you already use.</p>
      <ul className="flex flex-wrap gap-1.5">
        {tools.map((t) => (
          <li key={t}>
            <AxTag tone="white">{t}</AxTag>
          </li>
        ))}
      </ul>
    </div>
  );
}
