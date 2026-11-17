import "server-only";
import { PHOTO_MAX_BYTES, PHOTO_MAX_PER_ITEM, PHOTO_MAX_TOTAL } from "@/lib/lead-photos";

/** A checked photo, ready to store: which repair it shows, and the JPEG. */
export type LeadPhoto = { item: string; bytes: Buffer };

/**
 * Checks the photos sent with an estimate (lib/lead-photos.ts makes them):
 * each belongs to a repair that was picked, within the per-repair and total
 * limits, and is a JPEG of a sane size. The page only ever sends JPEGs it
 * drew itself, so anything else is refused rather than stored.
 *
 * None sent is an empty list; anything wrong is null.
 */
export function readPhotos(v: unknown, picked: string[]): LeadPhoto[] | null {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || v.length > PHOTO_MAX_TOTAL) return null;
  const maxChars = Math.ceil((PHOTO_MAX_BYTES * 4) / 3) + 4;
  const photos: LeadPhoto[] = [];
  for (const p of v) {
    const { item, data } = (p ?? {}) as Record<string, unknown>;
    if (typeof item !== "string" || !picked.includes(item)) return null;
    if (photos.filter((x) => x.item === item).length >= PHOTO_MAX_PER_ITEM) return null;
    if (typeof data !== "string" || data.length < 100 || data.length > maxChars) return null;
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return null;
    const bytes = Buffer.from(data, "base64");
    // JPEG's start-of-image marker.
    if (bytes.length > PHOTO_MAX_BYTES || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return null;
    photos.push({ item, bytes });
  }
  return photos;
}
