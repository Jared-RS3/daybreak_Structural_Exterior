import "server-only";
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";

/* ==========================================================================
   The PDF a homeowner gets from the live tools: the house estimator's
   ballpark, or the crack checker's report. Drawn with pdf-lib in plain
   JavaScript, so it builds the same on a laptop and in a serverless
   function, with nothing to install and nothing sent to another service.

   Built in the site's language: black header with a sunrise rule, mono
   labels, hairline tables. It says on its face that it's a sample from a
   demo company, the same as the tool does.
   ========================================================================== */

type Contact = { name: string; zip: string };

export type QuoteDoc = { reference: string; date: Date; contact: Contact } & (
  | {
      kind: "estimate";
      low: number;
      high: number;
      lines: { label: string; detail: string; low: number; high: number }[];
    }
  | {
      kind: "crack";
      level: { id: "watch" | "inspect" | "soon"; label: string; line: string };
      cause: string;
      answers: [string, string][];
      fixes: { label: string; range: string }[];
    }
);

const ink = rgb(0x1c / 255, 0x1c / 255, 0x1c / 255);
const muted = rgb(0x68 / 255, 0x68 / 255, 0x6d / 255);
const rule = rgb(0xdc / 255, 0xdc / 255, 0xdc / 255);
const panel = rgb(0xf3 / 255, 0xf3 / 255, 0xf4 / 255);
const sun = rgb(0xfc / 255, 0xc6 / 255, 0x00 / 255);
const white = rgb(1, 1, 1);

const tones = {
  watch: { bg: rgb(0xe3 / 255, 0xf4 / 255, 0xea / 255), fg: rgb(0x1d / 255, 0x6b / 255, 0x3f / 255) },
  inspect: { bg: rgb(0xff / 255, 0xf4 / 255, 0xd6 / 255), fg: rgb(0x8a / 255, 0x5a / 255, 0x00 / 255) },
  soon: { bg: rgb(0xfd / 255, 0xe7 / 255, 0xe4 / 255), fg: rgb(0xa8 / 255, 0x32 / 255, 0x1f / 255) },
};

const W = 612; // US Letter
const H = 792;
const M = 54; // margin

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * The standard PDF fonts only cover Windows-1252. Swap the few characters the
 * tools use that it lacks, and anything else outside it (a name in another
 * script) for "?", so a name can never stop the PDF being made.
 */
export function pdfSafe(v: string): string {
  return v
    .replace(/⅛/g, "1/8")
    .replace(/¼/g, "1/4")
    .replace(/[→⟶]/g, "->")
    .replace(/[^\x20-\x7e -ÿ–—‘’“”•…€]/g, "?");
}

export async function renderQuotePdf(doc: QuoteDoc): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const title = doc.kind === "estimate" ? "Your ballpark repair estimate" : "Your crack check report";
  pdf.setTitle(`${title} · ${doc.reference}`);
  pdf.setAuthor("Daybreak Structure-Works");
  pdf.setCreator("Daybreak Structure-Works");
  pdf.setCreationDate(doc.date);

  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);

  let page: PDFPage = pdf.addPage([W, H]);
  let y = H;

  const text = (s: string, x: number, at: number, size: number, font: PDFFont = sans, color = ink) =>
    page.drawText(pdfSafe(s), { x, y: at, size, font, color });

  /** Splits text into lines that fit `width`. */
  const wrap = (s: string, size: number, width: number, font: PDFFont = sans) => {
    const out: string[] = [];
    let line = "";
    for (const word of pdfSafe(s).split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && line) {
        out.push(line);
        line = word;
      } else line = next;
    }
    if (line) out.push(line);
    return out;
  };

  /** Writes a wrapped paragraph from the current position and moves down. */
  const para = (s: string, size: number, opts: { font?: PDFFont; color?: typeof ink; x?: number; width?: number; lead?: number } = {}) => {
    const x = opts.x ?? M;
    const lead = opts.lead ?? size * 1.45;
    for (const l of wrap(s, size, opts.width ?? W - M - x, opts.font)) {
      need(lead);
      text(l, x, y - size, size, opts.font, opts.color);
      y -= lead;
    }
  };

  const label = (s: string, at = y) => text(s.toUpperCase(), M, at, 8.5, mono, muted);

  const hr = (at = y, color = rule) =>
    page.drawLine({ start: { x: M, y: at }, end: { x: W - M, y: at }, thickness: 0.75, color });

  /** A new page when what comes next won't fit above the footer. */
  const need = (space: number) => {
    if (y - space > 86) return;
    page = pdf.addPage([W, H]);
    y = H - M;
  };

  /**
   * A two-column table. By default, words on the left and a figure on the
   * right. With `labelWidth`, a short label on the left and the answer
   * wrapping beside it, for answers that can run long.
   */
  const table = (rows: [string, string][], opts: { labelWidth?: number } = {}) => {
    hr();
    for (const [left, right] of rows) {
      if (opts.labelWidth) {
        const lines = wrap(right, 10.5, W - 2 * M - opts.labelWidth);
        const h = lines.length * 14 + 10;
        need(h);
        text(left, M, y - 16, 10.5, sans, muted);
        lines.forEach((l, i) => text(l, M + opts.labelWidth!, y - 16 - i * 14, 10.5));
        y -= h;
      } else {
        const rightW = sans.widthOfTextAtSize(pdfSafe(right), 10.5);
        const lines = wrap(left, 10.5, W - 2 * M - rightW - 24);
        const h = lines.length * 14 + 10;
        need(h);
        lines.forEach((l, i) => text(l, M, y - 16 - i * 14, 10.5));
        text(right, W - M - rightW, y - 16, 10.5);
        y -= h;
      }
      hr();
    }
  };

  // ---- Header: black band, the name, a sunrise rule ----
  page.drawRectangle({ x: 0, y: H - 78, width: W, height: 78, color: ink });
  page.drawRectangle({ x: 0, y: H - 82, width: W, height: 4, color: sun });
  text("Daybreak Structure-Works", M, H - 46, 17, bold, white);
  const tag = "SAMPLE · LIVE TOOL DEMO";
  text(tag, W - M - mono.widthOfTextAtSize(tag, 8.5), H - 44, 8.5, mono, sun);
  y = H - 82 - 40;

  // ---- Title and who it's for ----
  label(doc.kind === "estimate" ? "Instant repair estimate" : "Crack & symptom checker");
  y -= 16;
  para(title, 24, { lead: 30 });
  y -= 10;

  const meta: [string, string][] = [
    ["Prepared for", doc.contact.name],
    ["Property ZIP", doc.contact.zip],
    ["Date", doc.date.toLocaleDateString("en-US", { dateStyle: "long", timeZone: "America/Chicago" })],
    ["Reference", doc.reference],
  ];
  const colW = (W - 2 * M) / meta.length;
  hr();
  meta.forEach(([k, v], i) => {
    text(k.toUpperCase(), M + i * colW, y - 16, 7.5, mono, muted);
    const fit = wrap(v, 10.5, colW - 10)[0] ?? "";
    text(fit, M + i * colW, y - 31, 10.5);
  });
  y -= 44;
  hr();
  y -= 28;

  // ---- The answer ----
  if (doc.kind === "estimate") {
    label("Your ballpark range");
    y -= 14;
    text(`${usd(doc.low)} – ${usd(doc.high)}`, M, y - 30, 32, bold);
    y -= 52;
    para(
      `For the ${doc.lines.length === 1 ? "repair" : `${doc.lines.length} repairs`} you picked, from typical projects. The exact price comes from a free inspection.`,
      10.5,
      { color: muted },
    );
    y -= 16;
    label("What's included");
    y -= 8;
    table(
      doc.lines.map((l) => [l.detail ? `${l.label} (${l.detail})` : l.label, `${usd(l.low)} – ${usd(l.high)}`]),
    );
  } else {
    const tone = tones[doc.level.id];
    label("Our read");
    y -= 12;
    const pillW = bold.widthOfTextAtSize(doc.level.label, 11) + 34;
    page.drawRectangle({ x: M, y: y - 26, width: pillW, height: 26, color: tone.bg });
    page.drawCircle({ x: M + 13, y: y - 13, size: 3, color: tone.fg });
    text(doc.level.label, M + 23, y - 17, 11, bold, tone.fg);
    y -= 42;
    para(doc.level.line, 13.5, { lead: 19 });
    y -= 12;
    label("Most likely cause");
    y -= 6;
    para(doc.cause, 10.5);
    y -= 12;
    label("What you told us");
    y -= 8;
    table(doc.answers, { labelWidth: 110 });
    y -= 16;
    need(60);
    label("What it usually costs to fix");
    y -= 8;
    table(doc.fixes.map((f) => [f.label, f.range]));
  }

  // ---- What happens next ----
  y -= 18;
  const next =
    doc.kind === "estimate"
      ? "A specialist will call to book your free, no-obligation inspection. Soil, access, depth and how far the problem has gone all change the price, so the inspection gives you the real number in writing."
      : "This is a rule of thumb from what you told us, not an engineering assessment. A free inspection measures the movement and gives you the real answer, and the price, in writing.";
  const nextLines = wrap(next, 10.5, W - 2 * M - 36);
  const boxH = 40 + nextLines.length * 15;
  need(boxH);
  page.drawRectangle({ x: M, y: y - boxH, width: W - 2 * M, height: boxH, color: panel });
  page.drawRectangle({ x: M, y: y - boxH, width: 3, height: boxH, color: sun });
  text("WHAT HAPPENS NEXT", M + 18, y - 22, 8.5, mono, ink);
  nextLines.forEach((l, i) => text(l, M + 18, y - 40 - i * 15, 10.5));
  y -= boxH;

  // ---- Footer on every page ----
  for (const p of pdf.getPages()) {
    p.drawLine({ start: { x: M, y: 74 }, end: { x: W - M, y: 74 }, thickness: 0.75, color: rule });
    const foot = wrap(
      "Sample prices for a demo company, from a Daybreak Structure-Works live tool. On your site, this report carries your logo, your prices and your phone number, and every one reaches you as a lead.",
      8,
      W - 2 * M,
    );
    foot.forEach((l, i) => p.drawText(l, { x: M, y: 60 - i * 11, size: 8, font: sans, color: muted }));
    p.drawText("daybreakstructureworks.com", { x: M, y: 30, size: 8, font: mono, color: ink });
  }

  return pdf.save();
}
