/* ==========================================================================
   Photos a homeowner adds to a repair in the estimator: the limits the page
   and the route (app/api/tool-lead, lib/server/lead-photos.ts) both hold to,
   and the browser side, which shrinks each one before it's sent.

   Phone photos are 3–12 MB, which is more than a form should post and more
   than Airtable takes per file (5 MB). So the page redraws each one onto a
   canvas, at most PHOTO_EDGE pixels on its long side, as a JPEG. That also
   drops the file's hidden details (EXIF), including where it was taken.

   The limits keep the whole request under Netlify's 6 MB function payload:
   PHOTO_MAX_TOTAL photos of at most PHOTO_MAX_BYTES, as base64 in the JSON.
   ========================================================================== */

export const PHOTO_MAX_PER_ITEM = 3;
export const PHOTO_MAX_TOTAL = 6;
/** A shrunk photo, in bytes. Most come out at 150–400 KB. */
export const PHOTO_MAX_BYTES = 600_000;
const PHOTO_EDGE = 1600;

/** The request body with every photo at its largest, plus room for the rest of the form. */
export const PHOTO_BODY_BYTES = Math.ceil((PHOTO_MAX_TOTAL * PHOTO_MAX_BYTES * 4) / 3) + 64_000;

/**
 * Redraws a picked image as a JPEG small enough to send, smaller and softer
 * each try until it fits. Browsers apply the camera's rotation when they
 * draw it, so the result is the right way up. Throws when the browser can't
 * read the file (a HEIC on a desktop browser, a PDF renamed .jpg).
 */
export async function shrinkPhoto(file: File): Promise<{ blob: Blob; base64: string }> {
  const src = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    const long = Math.max(img.naturalWidth, img.naturalHeight);
    if (!long) throw new Error("Empty image");
    let edge = PHOTO_EDGE;
    let quality = 0.82;
    for (let tries = 0; tries < 5; tries++) {
      const scale = Math.min(1, edge / long);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas");
      // A transparent PNG would otherwise turn black as a JPEG.
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", quality));
      if (!blob) throw new Error("Couldn't encode");
      if (blob.size <= PHOTO_MAX_BYTES) return { blob, base64: await toBase64(blob) };
      edge = Math.round(edge * 0.8);
      quality = Math.max(0.5, quality - 0.08);
    }
    throw new Error("Too large");
  } finally {
    URL.revokeObjectURL(src);
  }
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((done, fail) => {
    const reader = new FileReader();
    reader.onload = () => done(String(reader.result).replace(/^data:[^,]*,/, ""));
    reader.onerror = () => fail(reader.error);
    reader.readAsDataURL(blob);
  });
}
