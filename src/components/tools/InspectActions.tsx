import type { Cta } from "@/lib/template/types";
import { PillLink } from "@/components/template/primitives";

/**
 * The pair of actions on the sky: book the free inspection, and — where the
 * page is about foundations or crawl spaces — check a crack online first.
 */
export function InspectActions({ book, check }: { book: Cta; check?: Cta }) {
  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <PillLink href={book.href} variant="light" size="lg">
        {book.label}
      </PillLink>
      {check && (
        <PillLink href={check.href} variant="glass" size="lg">
          {check.label}
        </PillLink>
      )}
    </div>
  );
}
