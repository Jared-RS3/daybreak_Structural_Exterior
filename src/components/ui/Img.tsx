import NextImage from "next/image";
import { imageMeta } from "@/lib/blur";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
};

/**
 * Wrapper around next/image that pulls the generated LQIP + intrinsic size
 * for anything living in /public/images, so every photo fades in from a blur
 * and never causes layout shift.
 */
export function Img({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  fill = true,
  quality = 82,
}: Props) {
  const meta = imageMeta[src];

  const shared = {
    src,
    alt,
    sizes,
    priority,
    quality,
    placeholder: meta ? ("blur" as const) : undefined,
    blurDataURL: meta?.blur,
    className: cn("object-cover", className),
  };

  if (fill) return <NextImage {...shared} fill />;

  return <NextImage {...shared} width={meta?.w ?? 1600} height={meta?.h ?? 1067} />;
}
