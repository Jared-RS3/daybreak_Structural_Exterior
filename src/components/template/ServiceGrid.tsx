import Link from "next/link";
import type { Service } from "@/lib/template/types";
import { Img } from "@/components/ui/Img";
import { PillLabel } from "./primitives";

/**
 * Crest's service grid: a grey tray per service, the photograph inset with a
 * smaller radius, the name and one line centred underneath. Split in two —
 * the specialty first, then the trades around it — so a foundation company
 * that also does siding still reads as a foundation company.
 *
 * Every card links to its service page, so the grid is also the service nav.
 */
export function ServiceGrid({
  services,
  base,
  labels,
}: {
  services: Service[];
  base: string;
  labels: { specialty: string; more: string };
}) {
  const groups = [
    { key: "specialty", label: labels.specialty, items: services.filter((s) => s.group === "specialty") },
    { key: "more", label: labels.more, items: services.filter((s) => s.group === "more") },
  ].filter((g) => g.items.length);

  return (
    <div className="space-y-14">
      {groups.map((g) => (
        <div key={g.key}>
          <div className="mb-5 flex justify-center">
            <PillLabel tone="white" className="border border-line">
              {g.label}
            </PillLabel>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((s) => (
              <li key={s.slug}>
                <Link href={`${base}/services/${s.slug}`} className="group flex h-full flex-col rounded-[28px] bg-card p-2.5">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[20px]">
                    <Img
                      src={s.image}
                      alt={`${s.title}: ${s.short}`}
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                      className="transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-5 pt-6 text-center">
                    <h3 className="home-title text-[21px] text-fg">{s.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-[15px] leading-[1.5] text-muted">{s.short}</p>
                    <p className="mt-auto pt-4 text-[13.5px] text-muted">
                      {s.priceFrom === "Free" ? (
                        <span className="font-medium text-fg">Free</span>
                      ) : (
                        <>
                          From <span className="font-medium text-fg">{s.priceFrom}</span>
                        </>
                      )}{" "}
                      · {s.timeline}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
