"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Cta } from "@/lib/template/types";
import { Icon, type IconKey } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { pillClass } from "./pill";

/**
 * Thumb-reach action bar for phones: the main action at two thirds of the
 * width, a quick secondary (usually Call) beside it. Hidden on pages that
 * already are the conversion, like an estimator or a booking form.
 */
export function StickyCta({
  primary,
  secondary,
  hideOn,
  spacerClassName = "bg-sky-5",
}: {
  primary: Cta;
  secondary: Cta & { icon?: IconKey };
  hideOn: string[];
  /** Matches the footer's background, so the spacer under it is invisible. */
  spacerClassName?: string;
}) {
  const pathname = usePathname();
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid grid-cols-[1fr_2fr] gap-2 p-2.5">
          <a href={secondary.href} className={cn(pillClass("soft", "lg"), "px-0")}>
            {secondary.icon && <Icon name={secondary.icon} className="size-4.5" />}
            {secondary.label}
          </a>
          <Link href={primary.href} className={cn(pillClass("dark", "lg"), "px-0")}>
            {primary.label}
          </Link>
        </div>
      </div>
      {/* Keeps the footer's last line clear of the bar. */}
      <div aria-hidden className={cn("h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden", spacerClassName)} />
    </>
  );
}
