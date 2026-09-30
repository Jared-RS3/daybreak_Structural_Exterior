import type { TrustItem } from "@/lib/template/types";
import { Stars } from "./primitives";

/**
 * Five facts in one line under the hero, set the way Crest sets its "20+
 * Years in business" figures: the number in the display face, the qualifier
 * beside it in grey. No boxes, no icons.
 */
export function TrustRow({ items }: { items: TrustItem[] }) {
  return (
    <ul className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-5 lg:gap-x-0">
      {items.map((t, i) => (
        <li
          key={t.label}
          className={
            "flex items-center gap-2.5 text-center lg:px-8 " + (i > 0 ? "lg:border-l lg:border-line" : "")
          }
        >
          {t.rating && <Stars />}
          <span className="font-home text-[19px] font-medium tracking-[-0.02em] text-fg tabular-nums">{t.value}</span>
          <span className="text-[14.5px] text-muted">{t.label}</span>
        </li>
      ))}
    </ul>
  );
}
