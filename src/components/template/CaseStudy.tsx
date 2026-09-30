import Link from "next/link";
import type { Project, Review } from "@/lib/template/types";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils";
import { BeforeAfter } from "./BeforeAfter";
import { ArrowLink, Initials, Stars } from "./primitives";

const days = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

/** Location → problem → solution → result → proof, in one grey tray. */
export function CaseStudyLead({
  project: p,
  review,
  href,
}: {
  project: Project;
  review?: Review;
  href: string;
}) {
  return (
    <article className="grid gap-2 rounded-[32px] bg-card p-2 sm:gap-2.5 sm:p-2.5 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {p.beforeAfter ? (
          <BeforeAfter
            before={{
              label: p.beforeAfter.before.label,
              node: <Img src={p.beforeAfter.before.src} alt={p.beforeAfter.before.alt} sizes="(min-width:1024px) 56vw, 100vw" />,
            }}
            after={{
              label: p.beforeAfter.after.label,
              node: <Img src={p.beforeAfter.after.src} alt={p.beforeAfter.after.alt} sizes="(min-width:1024px) 56vw, 100vw" />,
            }}
            note={p.beforeAfter.placeholderNote}
            className="aspect-[4/3] h-full lg:aspect-auto lg:min-h-[36rem]"
          />
        ) : (
          <div className="relative aspect-[4/3] h-full overflow-hidden rounded-[24px]">
            <Img src={p.image.src} alt={p.image.alt} sizes="(min-width:1024px) 56vw, 100vw" />
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-[24px] bg-white p-6 sm:p-8 lg:col-span-5">
        <div className="flex flex-wrap gap-2">
          <span className="pill-label bg-card font-medium text-fg">{p.location}</span>
          {p.insurance && <span className="pill-label bg-sky-4 font-medium text-fg">Insurance claim</span>}
        </div>
        <h3 className="home-heading mt-5 text-[clamp(1.6rem,2.6vw,2.2rem)] text-fg">
          <Link href={href} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {p.title}
          </Link>
        </h3>

        <dl className="mt-6 space-y-4">
          {[
            ["The problem", p.problem],
            ["What we did", p.solution],
            ["The result", p.result],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13.5px] text-muted">{k}</dt>
              <dd className="mt-0.5 text-[15px] leading-[1.55] text-fg">{v}</dd>
            </div>
          ))}
        </dl>

        <Specs project={p} className="mt-7" />

        {review && (
          <figure className="mt-7 rounded-[18px] bg-card p-5">
            <Stars count={review.rating} />
            <blockquote className="mt-3 text-[15px] leading-[1.55] text-fg">&ldquo;{review.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3 text-[13.5px]">
              <Initials name={review.name} className="size-8 bg-white text-[11px]" />
              <span>
                <span className="font-medium text-fg">{review.name}</span>
                <span className="text-muted">
                  {" "}
                  · {review.city} · {review.source} review
                </span>
              </span>
            </figcaption>
          </figure>
        )}

        <ArrowLink href={href} className="mt-7 lg:mt-auto lg:pt-7">
          Read the full project
        </ArrowLink>
      </div>
    </article>
  );
}

export function Specs({ project: p, className }: { project: Project; className?: string }) {
  const rows = [...p.specs.map((x) => [x.label, x.value]), ["On site", days(p.days)]];
  return (
    <div className={className}>
      <dl className="grid grid-cols-3 gap-2">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-[16px] bg-card px-3.5 py-3">
            <dt className="text-[12.5px] text-muted">{k}</dt>
            <dd className="font-home mt-0.5 text-[18px] font-medium tracking-[-0.02em] text-fg tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[13.5px] text-muted">
        <span className="text-fg">Material:</span> {p.material}
      </p>
    </div>
  );
}

/** Crest's service card, used for projects: grey tray, inset photo, centred text. */
export function CaseStudyCard({
  project: p,
  href,
  aspect = "aspect-[4/3]",
  sizes = "(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw",
}: {
  project: Project;
  href: string;
  aspect?: string;
  sizes?: string;
}) {
  return (
    <article className="h-full">
      <Link href={href} className="group flex h-full flex-col rounded-[28px] bg-card p-2.5">
        <div className={cn("relative overflow-hidden rounded-[20px]", aspect)}>
          <Img
            src={p.image.src}
            alt={p.image.alt}
            sizes={sizes}
            className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-1 flex-col px-4 pb-4 pt-5 text-center">
          <p className="text-[13.5px] text-muted">
            {p.location} · {p.category}
          </p>
          <h3 className="home-title mt-1.5 text-[19px] text-fg">{p.title}</h3>
          <p className="mt-2 text-[14.5px] leading-[1.5] text-muted">{p.result}</p>
          <p className="mt-auto pt-4 text-[13px] text-muted tabular-nums">
            {p.size} · {days(p.days)} on site
          </p>
        </div>
      </Link>
    </article>
  );
}
