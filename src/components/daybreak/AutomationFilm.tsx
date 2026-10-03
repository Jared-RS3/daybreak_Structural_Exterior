"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { AxLabel, axTitle } from "./ax";

/**
 * The founders' note: a short film on why a business has to run without its
 * owner on the phone, at full size: the heading beside a film that takes the
 * wider half of the row.
 *
 * The film's captions are burned in, so it works silent. While it's on
 * screen it plays muted on a loop as a preview; it pauses once it scrolls
 * away, so it never costs anything off screen. "Watch with sound" starts it
 * from the top with audio and native controls. With reduced motion nothing
 * plays until it's asked to.
 *
 * Analytics (only with the visitor's consent, lib/analytics.ts): video_start
 * when they choose to watch with sound, video_progress at halfway and
 * video_complete at the end. The muted preview isn't counted: nobody chose
 * to watch it.
 */
export function AutomationFilm({
  label,
  title,
  lede,
  src,
  poster,
  duration,
}: {
  label: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  src: string;
  poster: string;
  /** Shown on the button, e.g. "0:28". */
  duration: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const halfway = useRef(false);
  const film = { video_title: "Founders' film", video_url: src };

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause();
        // The muted preview resumes on its own; the sound version waits to be asked.
        else if (!still && v.muted) v.play().catch(() => {});
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const watch = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.loop = false;
    setSound(true);
    halfway.current = false;
    track("video_start", film);
    v.play().catch(() => {});
  };

  return (
    <div>
      <div className="flex justify-center border-t border-rule pt-6 lg:justify-start">
        <AxLabel>{label}</AxLabel>
      </div>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="text-center lg:col-span-5 lg:text-left">
          <h2 className={`${axTitle} text-fg`}>
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-[1.6] text-muted lg:mx-0">{lede}</p>
        </div>

        {/* The button sits under the film, not on it, so it never covers
            the burned-in captions on a phone-sized frame. */}
        <div className="lg:col-span-7">
          <div className="relative aspect-video overflow-hidden bg-fg">
            <video
              ref={video}
              src={src}
              poster={poster}
              muted
              loop
              playsInline
              preload="metadata"
              controls={sound}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (!sound || halfway.current || !v.duration || v.currentTime / v.duration < 0.5) return;
                halfway.current = true;
                track("video_progress", { ...film, video_percent: 50 });
              }}
              onEnded={() => sound && track("video_complete", film)}
              aria-label="Why automation matters for your business (video, captions on screen)"
              className="size-full object-cover"
            />
            {!sound && (
              <button type="button" tabIndex={-1} aria-hidden onClick={watch} className="absolute inset-0 cursor-pointer" />
            )}
          </div>
          <button
            type="button"
            onClick={watch}
            disabled={sound}
            className={cn(
              "mono-label flex w-full items-center justify-between gap-3 bg-fg px-4 py-3.5 text-[12px] text-white transition-colors sm:px-5 sm:text-[13px]",
              sound ? "cursor-default" : "hover:bg-black",
            )}
          >
            <span className="flex items-center gap-2.5">
              <Icon name="play" filled className="size-4 text-sun" />
              {sound ? "Playing with sound" : "Watch with sound"}
            </span>
            <span className="text-white/60">{duration}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
