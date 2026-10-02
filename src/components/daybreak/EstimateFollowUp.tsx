import { cn } from "@/lib/utils";
import { AxLabel } from "./ax";

/**
 * The second leak, after the live run: one estimate followed up over a month.
 * A timeline in ruled columns on desktop and ruled rows on phones; the step a
 * person does is marked in black, the automatic ones in sunrise yellow, and
 * the reply that stops it all closes on a black bar.
 */
export function EstimateFollowUp({
  label,
  title,
  lede,
  steps,
  reply,
}: {
  label: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  steps: { when: string; day: number; text: string; kind: string }[];
  reply: string;
}) {
  return (
    <div className="mt-20 border-t border-rule pt-6 lg:mt-28">
      <div className="flex justify-center lg:justify-start">
        <AxLabel>{label}</AxLabel>
      </div>
      <div className="mt-10 grid gap-6 text-center lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-10 lg:text-left">
        <h3 className="font-home text-[clamp(2rem,3.6vw,3.2rem)] font-normal leading-[1.06] tracking-[-0.03em] text-fg lg:col-span-7">
          {title}
        </h3>
        <p className="mx-auto max-w-md text-[17px] leading-[1.6] text-muted lg:col-span-5 lg:mx-0 lg:pb-1.5">{lede}</p>
      </div>

      <ol aria-label="One estimate, followed up over 30 days" className="mt-12 border-b border-rule lg:mt-14 lg:grid lg:grid-cols-6 lg:border-b-0">
        {steps.map((s, i) => (
          <li
            key={s.when}
            className={cn(
              "grid grid-cols-[7rem_1fr] gap-4 border-t py-4 sm:grid-cols-[9rem_1fr] lg:block lg:pb-0 lg:pr-5 lg:pt-4",
              i === 0 ? "border-fg" : "border-rule lg:border-fg",
            )}
          >
            <p className="mono-label text-[12px] text-fg">
              {s.when}
              <span className="mt-1 block text-muted">Day {s.day}</span>
            </p>
            <div>
              <p className="font-home text-[18px] leading-[1.35] tracking-[-0.015em] text-fg lg:mt-8 lg:text-[19px]">{s.text}</p>
              <p className="mono-label mt-3 inline-flex items-center gap-2 text-[11.5px] text-muted">
                <span aria-hidden className={cn("size-1.5", i === 0 ? "bg-fg" : "bg-sun")} />
                {s.kind}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 flex items-center gap-3 bg-fg px-5 py-4 text-[16.5px] leading-[1.5] text-white lg:mt-12">
        <span aria-hidden className="size-2 shrink-0 bg-sun" />
        {reply}
      </p>
    </div>
  );
}
