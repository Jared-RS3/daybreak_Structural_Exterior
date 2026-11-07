import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { southeast } from "./southeast";

/* The Southeast Crawlspace Consulting estimate PDF. /api/tool-lead draws it
   for a lead from /demo/southeast (brand "southeast"), emails it to the
   homeowner, attaches it
   to their Airtable row and hands it back for download, exactly as it does
   Daybreak's own quote PDF (lib/server/quote-pdf.ts). */

export type PdfLine = { fix: string; size: string; low: number; high: number };
export type PdfInput = {
  name: string;
  zip: string;
  phone: string;
  email: string;
  lines: PdfLine[];
  low: number;
  high: number;
  reference: string;
  date?: Date;
  /** The logo PNG. Left out, or unreadable, the header falls back to the name in type. */
  logo?: Uint8Array;
};

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
/** Helvetica only encodes WinAnsi; anything else becomes a plain stand-in. */
const safe = (s: string) =>
  s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7e–—•]/g, "-");

const blue = rgb(43 / 255, 108 / 255, 164 / 255);
const navy = rgb(29 / 255, 76 / 255, 118 / 255);
const ink = rgb(0.13, 0.13, 0.13);
const muted = rgb(0.38, 0.38, 0.4);
const rule = rgb(0.86, 0.86, 0.88);
const pale = rgb(0.92, 0.95, 0.98);

export async function createSoutheastPdf(input: PdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Your ballpark repair estimate");
  doc.setSubject("Sample estimate from a concept demo prepared by Daybreak StructureWorks");
  doc.setProducer("Daybreak StructureWorks");
  const page = doc.addPage([612, 792]);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 612;
  const M = 48;

  const text = (p: PDFPage, s: string, x: number, y: number, size: number, font: PDFFont, color = ink) =>
    p.drawText(safe(s), { x, y, size, font, color });
  const right = (p: PDFPage, s: string, xRight: number, y: number, size: number, font: PDFFont, color = ink) =>
    text(p, s, xRight - font.widthOfTextAtSize(safe(s), size), y, size, font, color);
  /** Wraps a paragraph to `width`, returning the y below it. */
  const para = (s: string, x: number, y: number, width: number, size: number, font: PDFFont, color = muted) => {
    let row = "";
    for (const word of safe(s).split(/\s+/)) {
      const next = row ? `${row} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && row) {
        page.drawText(row, { x, y, size, font, color });
        y -= size * 1.45;
        row = word;
      } else row = next;
    }
    if (row) page.drawText(row, { x, y, size, font, color });
    return y - size * 1.45;
  };

  // ---- Header: the blue rule, the logo, the title ----
  page.drawRectangle({ x: 0, y: 784, width: W, height: 8, color: blue });
  let logoBottom = 700;
  try {
    if (!input.logo) throw new Error("No logo");
    const logo = await doc.embedPng(input.logo);
    const h = 58;
    const w = (logo.width / logo.height) * h;
    page.drawImage(logo, { x: M, y: 712, width: w, height: h });
    logoBottom = 712;
  } catch {
    text(page, southeast.name, M, 740, 14, bold);
  }
  const date = (input.date ?? new Date()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  right(page, "Your Ballpark Repair Estimate", W - M, 748, 16, bold);
  right(page, date, W - M, 730, 10, regular, muted);
  right(page, `Ref. ${input.reference}`, W - M, 716, 10, regular, muted);

  // ---- Who it's for ----
  let y = logoBottom - 30;
  page.drawLine({ start: { x: M, y: y + 14 }, end: { x: W - M, y: y + 14 }, thickness: 1, color: rule });
  text(page, "PREPARED FOR", M, y - 4, 8.5, bold, muted);
  text(page, input.name, M, y - 20, 13, bold);
  text(page, [input.phone, input.email, `ZIP ${input.zip}`].filter(Boolean).join("   •   "), M, y - 36, 10, regular, muted);
  y -= 74;

  // ---- The lines ----
  const colSize = 330;
  text(page, "REPAIR", M, y, 8.5, bold, muted);
  text(page, "SIZE", colSize, y, 8.5, bold, muted);
  right(page, "BALLPARK", W - M, y, 8.5, bold, muted);
  y -= 10;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: ink });
  for (const l of input.lines) {
    y -= 22;
    text(page, l.fix, M, y, 11, bold);
    text(page, l.size, colSize, y, 10, regular, muted);
    right(page, `${usd(l.low)} – ${usd(l.high)}`, W - M, y, 11, regular);
    y -= 10;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: rule });
  }

  // ---- The total ----
  y -= 50;
  page.drawRectangle({ x: M, y: y - 14, width: W - 2 * M, height: 58, color: pale });
  page.drawRectangle({ x: M, y: y - 14, width: 5, height: 58, color: blue });
  text(page, "YOUR BALLPARK RANGE", M + 22, y + 22, 8.5, bold, navy);
  text(page, `${usd(input.low)} – ${usd(input.high)}`, M + 22, y - 2, 22, bold, navy);
  right(page, `${input.lines.length} ${input.lines.length === 1 ? "repair" : "repairs"}`, W - M - 18, y + 4, 10, regular, muted);

  // ---- What happens next ----
  y -= 60;
  text(page, "Your next step: a free, no-obligation inspection", M, y, 12.5, bold);
  y = para(
    "Every home is different. A free crawlspace inspection, with 3D Lidar rendering, pinpoints the problem and gives you an exact price in writing.",
    M, y - 18, W - 2 * M, 10.5, regular,
  );
  text(page, `Call ${southeast.phone}`, M, y - 6, 12.5, bold, navy);

  // ---- The fine print ----
  page.drawLine({ start: { x: M, y: 92 }, end: { x: W - M, y: 92 }, thickness: 0.6, color: rule });
  para(
    "SAMPLE ESTIMATE FROM A CONCEPT DEMO built for Southeast Crawlspace Consulting by Daybreak StructureWorks, which runs the demo. Southeast Crawlspace Consulting has not received your details. The prices are sample figures, not their pricing. A ballpark only, not a quote.",
    M, 76, W - 2 * M, 8.5, regular,
  );

  return doc.save();
}
