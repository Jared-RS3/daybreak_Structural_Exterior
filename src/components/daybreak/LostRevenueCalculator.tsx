"use client";

import { useState } from "react";
import { usd } from "@/lib/quote";
import { cn } from "@/lib/utils";
import { AxButton, AxLabel } from "./ax";
import { Slider } from "./AxCalculator";

/**
 * What unanswered calls are worth, in the contractor's own numbers: missed
 * calls a month × their close rate × their average job. Plain arithmetic on
 * what they set, with no win-back rate of ours added.
 *
 * One square per missed call, so the number is something you can see; the
 * yellow ones are the jobs those calls would have become at their close rate.
 */
export function LostRevenueCalculator({ jobValue: initialJob, href }: { jobValue: number; href: string }) {
  const [calls, setCalls] = useState(20);
  const [job, setJob] = useState(initialJob);
  const [close, setClose] = useState(25);
  const jobs = calls * (close / 100);
  const monthly = Math.round(jobs * job);
  const lit = Math.round(jobs);

  return (
    <div>
      <div className="grid gap-2.5 lg:grid-cols-12">
        <div className="bg-white p-6 sm:p-8 lg:col-span-5 lg:p-10">
          <AxLabel>Your business</AxLabel>
          <div className="mt-6">
            <Slider
              label="Missed calls a month"
              hint="Calls nobody picked up, including after hours"
              value={calls}
              onChange={setCalls}
              min={1}
              max={100}
              step={1}
              format={String}
              accent
            />
            <Slider
              label="Average job"
              hint="What a typical job is worth to you"
              value={job}
              onChange={setJob}
              min={1000}
              max={40000}
              step={250}
              format={(v) => usd(v)}
            />
            <Slider
              label="Lead-to-job close rate"
              hint="How many leads you usually turn into jobs"
              value={close}
              onChange={setClose}
              min={5}
              max={80}
              step={1}
              format={(v) => `${v}%`}
            />
          </div>
        </div>

        <div className="flex flex-col border-t-[3px] border-sun bg-fg p-6 text-white sm:p-8 lg:col-span-7 lg:p-10">
          <AxLabel tone="light">Passing through unanswered calls</AxLabel>
          <p aria-live="polite" className="mt-6 flex flex-wrap items-baseline gap-x-3">
            <span className="font-home text-[clamp(3rem,7vw,5.5rem)] font-light leading-none tracking-[-0.04em] tabular-nums">
              {usd(monthly)}
            </span>
            <span className="font-home text-[clamp(1.25rem,2vw,1.75rem)] text-white/60">/month</span>
          </p>
          <p className="mt-4 max-w-md text-[17px] leading-[1.55] text-white/75">
            Potential revenue in calls nobody answered: about {lit === 1 ? "one job" : `${lit} jobs`} a month at your close rate.
          </p>

          <div aria-hidden className="mt-8 lg:mb-8">
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: calls }).map((_, i) => (
                <span key={i} className={cn("size-3.5 sm:size-4", i < lit ? "bg-sun" : "bg-white/25")} />
              ))}
            </div>
            <p className="mono-label mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/60">
              <span className="flex items-center gap-2">
                <span className="size-2.5 bg-white/25" /> A missed call
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 bg-sun" /> A job it could have been
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-auto">
            <p className="max-w-xs text-[16px] leading-[1.5] text-white/75">
              Win back just one and that&rsquo;s a {usd(job)} job.
            </p>
            <AxButton href={href} variant="light">
              Book a discovery call
            </AxButton>
          </div>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-[15px] leading-[1.6] text-muted">
        Illustrative estimate based on your inputs; not guaranteed recovered revenue.
      </p>
    </div>
  );
}
