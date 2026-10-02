import Link from "next/link";
import { Eyebrow } from "@/components/ui/Section";
import { legal } from "@/lib/agency";

/**
 * Shell for the legal documents.
 *
 * Deliberately the plainest thing on the site. A policy is read by someone
 * checking whether they are about to be tracked, or by a lawyer checking
 * whether the disclosure is adequate — neither of them wants display type,
 * both of them want a measure they can read and headings they can cite. So:
 * one column, real heading levels, and a section index at the top that links
 * to anchors, because "as described in Section 6" is useless without one.
 *
 * The documents share this shell so they cannot drift apart in tone or
 * in effective date — the date comes from `legal` in lib/agency.ts, which is
 * the single place it is recorded.
 */
export function LegalDoc({
  eyebrow,
  title,
  lede,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  /** Heading text and anchor id for every `<LegalSection>` on the page. */
  sections: { id: string; title: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-ink-900/12 bg-bone-50 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="container-x">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display-xl mt-6 max-w-3xl text-[clamp(2.2rem,4.6vw,3.4rem)] text-ink-900">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-[16.5px] leading-[1.62] text-ink-600">{lede}</p>
          <p className="numeric mt-7 text-[13px] text-ink-500">
            Effective {legal.effective} · {legal.entity}
          </p>
        </div>
      </header>

      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-20">
          {/* Sticky index. `nav` rather than a bare list so a screen reader can
              skip it, and it is ordered because the sections are cited by number. */}
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="annotation text-ink-400">On this page</h2>
            <ol className="mt-4 space-y-2.5 border-t border-ink-900/12 pt-4">
              {sections.map((s, i) => (
                <li key={s.id} className="flex gap-3">
                  <span className="numeric text-[12px] font-semibold text-ink-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${s.id}`}
                    className="text-[14px] leading-[1.45] text-ink-600 underline decoration-ink-900/20 underline-offset-4 transition-colors hover:text-ink-900 hover:decoration-ember-600"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}

/**
 * One numbered section. The number is rendered rather than left to a CSS
 * counter so it survives being copied into an email, which is how these
 * documents actually get quoted back at you.
 */
export function LegalSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink-900/12 pt-8 first:border-t-0 first:pt-0 [&+&]:mt-12">
      <h2 className="flex items-baseline gap-4 text-[clamp(1.15rem,1.9vw,1.4rem)] [font-weight:700] tracking-[-0.02em] text-ink-900">
        <span className="numeric text-[13px] font-semibold text-ink-400">
          {String(index).padStart(2, "0")}
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15.5px] leading-[1.68] text-ink-600">{children}</div>
    </section>
  );
}

/** Ruled list used for "what we collect" style enumerations. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="border-t border-ink-900/12">
      {items.map((item, i) => (
        <li
          key={i}
          className="border-b border-ink-900/12 py-3 text-[15px] leading-[1.6] text-ink-600"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Label–value rows for the company's registered details. A row whose value is
 * empty is left out, so a detail not yet filled in in lib/agency.ts is absent
 * from the page rather than shown as a placeholder.
 */
export function LegalDetails({ rows }: { rows: [label: string, value: React.ReactNode][] }) {
  return (
    <dl className="border-t border-ink-900/12">
      {rows
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 border-b border-ink-900/12 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="text-[14px] font-semibold text-ink-900">{label}</dt>
            <dd className="text-[15px] leading-[1.6] text-ink-600">{value}</dd>
          </div>
        ))}
    </dl>
  );
}

/**
 * The one thing on these pages that should stop a skimming reader. Used for
 * the statements that carry actual legal weight — that the estimator is not a
 * binding quote, that the demonstration contractor is fictional.
 */
export function LegalCallout({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-ember-500 bg-bone-100 py-4 pl-5 pr-5 text-[15px] leading-[1.62] text-ink-700">
      {children}
    </p>
  );
}

/** Cross-document footer so each policy points at the others. */
export function LegalFooterNav({ current }: { current: "privacy" | "terms" | "accessibility" | "paia" }) {
  const docs = [
    { key: "privacy", href: "/privacy", label: "Privacy Policy" },
    { key: "terms", href: "/terms", label: "Terms of Use" },
    { key: "accessibility", href: "/accessibility", label: "Accessibility" },
    { key: "paia", href: "/paia", label: "PAIA Manual" },
  ] as const;

  return (
    <nav
      aria-label="Other policies"
      className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-900/12 pt-8"
    >
      {docs
        .filter((d) => d.key !== current)
        .map((d) => (
          <Link
            key={d.key}
            href={d.href}
            className="text-[14.5px] font-semibold text-ink-700 underline decoration-ink-900/25 underline-offset-4 transition-colors hover:text-ink-900 hover:decoration-ember-600"
          >
            {d.label}
          </Link>
        ))}
    </nav>
  );
}
