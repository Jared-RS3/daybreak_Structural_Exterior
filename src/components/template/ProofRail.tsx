import Link from "next/link";
import type { Project, ProofItem, Review } from "@/lib/template/types";
import { Img } from "@/components/ui/Img";
import { usd } from "@/lib/quote";
import { Illustrative, Initials, SectionIntro, Stars } from "./primitives";
import { Rail } from "./Rail";

/**
 * Evidence rather than advertising: a finished job with its location and
 * size, the homeowner's words beside it, the figures someone else reported.
 * Three kinds of card in one rail so it reads as a collection of records,
 * not one card repeated.
 */
export function ProofRail({
  items,
  projects,
  reviews,
  base,
  title,
  lede,
}: {
  items: ProofItem[];
  projects: Project[];
  reviews: Review[];
  base: string;
  title: React.ReactNode;
  lede: React.ReactNode;
}) {
  return (
    <section aria-labelledby="proof-title" className="overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <Rail
        label="Recent projects and reviews"
        header={
          <SectionIntro
            id="proof-title"
            align="left"
            label={
              <>
                <span className="pill-label bg-accent-soft text-fg">Proof</span>
                <Illustrative />
              </>
            }
            title={title}
            lede={lede}
          />
        }
      >
        {items.map((item, i) => {
          if (item.kind === "project") {
            const p = projects.find((x) => x.slug === item.slug);
            return p ? <ProjectCard key={i} project={p} href={`${base}/projects/${p.slug}`} /> : null;
          }
          if (item.kind === "review") {
            const r = reviews.find((x) => x.id === item.id);
            return r ? <ReviewCard key={i} review={r} /> : null;
          }
          const r = reviews.find((x) => x.id === item.reviewId);
          return r?.figures ? <FiguresCard key={i} review={r} /> : null;
        })}
      </Rail>
    </section>
  );
}

const cardWidth = "w-[82vw] max-w-[23rem] shrink-0 snap-start";

function ProjectCard({ project: p, href }: { project: Project; href: string }) {
  return (
    <li className={cardWidth}>
      <Link href={href} className="group flex h-full flex-col rounded-[28px] bg-card p-2.5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
          <Img
            src={p.image.src}
            alt={p.image.alt}
            sizes="(min-width:640px) 23rem, 82vw"
            className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          {p.insurance && (
            <span className="pill-label absolute left-3 top-3 bg-white/90 font-medium text-fg">Insurance claim</span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
          <p className="text-[13.5px] text-muted">{p.location}</p>
          <h3 className="home-title mt-1.5 text-[19px] text-fg">{p.title}</h3>
          <p className="mt-auto pt-4 text-[13.5px] text-muted tabular-nums">
            {p.size} · {p.days} {p.days === 1 ? "day" : "days"} on site
          </p>
        </div>
      </Link>
    </li>
  );
}

function ReviewCard({ review: r }: { review: Review }) {
  return (
    <li className={cardWidth}>
      <figure className="flex h-full flex-col rounded-[28px] bg-card p-7">
        <Stars count={r.rating} />
        <p className="home-title mt-6 text-[22px] text-fg">{r.headline}</p>
        <blockquote className="mt-3 text-[15px] leading-[1.6] text-muted">&ldquo;{r.quote}&rdquo;</blockquote>
        <figcaption className="mt-auto flex items-center gap-3 pt-7">
          <Initials name={r.name} className="bg-white" />
          <span className="text-[14px] leading-tight">
            <span className="block font-medium text-fg">{r.name}</span>
            <span className="block text-muted">
              {r.city} · {r.source} review
            </span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

function FiguresCard({ review: r }: { review: Review }) {
  const [est, signed] = r.figures!;
  const max = Math.max(est.value, signed.value);
  const diff = ((signed.value - est.value) / est.value) * 100;

  return (
    <li className={cardWidth}>
      <figure className="flex h-full flex-col rounded-[28px] bg-sky-4 p-7">
        <p className="text-[14px] text-fg/70">{est.label} vs. {signed.label.toLowerCase()}</p>
        <dl className="mt-6 space-y-5">
          {[est, signed].map((f, i) => (
            <div key={f.label}>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[14px] text-fg/70">{f.label}</dt>
                <dd className="font-home text-[26px] font-medium tracking-[-0.03em] text-fg tabular-nums">{usd(f.value)}</dd>
              </div>
              <div aria-hidden className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
                <div
                  className={i === 0 ? "h-full rounded-full bg-fg/35" : "h-full rounded-full bg-fg"}
                  style={{ width: `${(f.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </dl>
        <p className="font-home mt-auto pt-10 text-[64px] font-medium leading-none tracking-[-0.05em] text-fg tabular-nums">
          {diff <= 0 ? "−" : "+"}
          {Math.abs(diff).toFixed(1)}%
        </p>
        <p className="mt-2 text-[14.5px] text-fg/75">
          {diff <= 0 ? "under" : "over"} the {est.label.toLowerCase()}, as {r.name.split(" ")[0]} {r.name.split(" ")[1]?.[0]}. in{" "}
          {r.city} reported it.
        </p>
      </figure>
    </li>
  );
}
