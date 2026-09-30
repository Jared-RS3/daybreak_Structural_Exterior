import type { Guarantee } from "@/lib/template/types";
import { Icon } from "@/components/ui/Icon";
import { AxHead } from "./ax";

/**
 * Terms as a ruled grid — each cell a commitment that's in the agreement.
 * Square cells with hairlines between them, like a schedule in a contract.
 */
export function AxTerms({
  items,
  title,
  lede,
  label = "Our terms",
}: {
  items: Guarantee[];
  title: React.ReactNode;
  lede: React.ReactNode;
  label?: string;
}) {
  return (
    <section aria-labelledby="terms-title" className="bg-panel py-20 sm:py-24 lg:py-28">
      <div className="container-wide">
        <AxHead id="terms-title" label={label} title={title} lede={lede} />
        <ul className="mt-14 grid gap-px bg-rule sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {items.map((t, i) => (
            <li key={t.title} className="flex flex-col bg-panel p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <Icon name={t.icon ?? "check"} className="size-6 text-fg" />
                <span className="mono-label text-[12.5px] text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-home mt-10 text-[21px] tracking-[-0.02em] text-fg">{t.title}</h3>
              <p className="mt-2 text-[16.5px] leading-[1.6] text-muted">{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
