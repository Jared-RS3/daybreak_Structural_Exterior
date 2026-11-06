import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { DemoAssessment } from "./assessment";
import type { ContractorEstimatorConfig } from "./config";

type Contact = { name: string; email: string; phone: string; city: string; zip: string };
const safe = (value: string) => value.replace(/[^\x20-\x7e\u2014]/g, "-").slice(0, 100);

/** Generated in the visitor's browser. No endpoint, email, CRM or storage. */
export async function createDemoPdf(config: ContractorEstimatorConfig, assessment: DemoAssessment, contact: Contact): Promise<Uint8Array> {
  if (config.mode !== "demo" || !config.pdf.enabled) throw new Error("Sample PDF is disabled.");
  const document = await PDFDocument.create();
  document.setTitle(config.pdf.watermark);
  document.setSubject("Independent Daybreak concept demo — no official quote or delivery");
  let page = document.addPage([612, 792]);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.03, 0.09, 0.13);
  const blue = rgb(0.02, 0.28, 0.91);
  const muted = rgb(0.25, 0.32, 0.38);
  let y = 742;
  const write = (value: string, size = 10, strong = false, color = navy) => {
    const font = strong ? bold : regular;
    const words = safe(value).split(/\s+/);
    let row = "";
    for (const word of words) {
      const next = row ? `${row} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > 515 && row) {
        page.drawText(row, { x: 48, y, size, font, color });
        y -= size + 5;
        row = word;
      } else row = next;
    }
    if (row) { page.drawText(row, { x: 48, y, size, font, color }); y -= size + 7; }
  };
  write(config.pdf.watermark, 13, true, blue);
  y -= 12;
  write(`${config.brand.text} | Example project lead`, 20, true);
  write("Independent Daybreak StructureWorks concept. No request was sent.", 10, false, muted);
  y -= 10;
  write(`Fictional customer: ${contact.name}`, 11, true);
  write(`Example contact: ${contact.email} | ${contact.phone}`);
  write(`Example property: ${contact.city}, ${contact.zip} | Service coverage to confirm`);
  y -= 10;
  write(`Priority: ${assessment.urgency}`, 11, true);
  write(`Estimate: ${assessment.status === "inspection" ? "Inspection required" : `${assessment.status === "partial" ? "Partial sample range" : "Sample planning range"} $${assessment.low.toLocaleString("en-US")} - $${assessment.high.toLocaleString("en-US")}`}`);
  write("Photo attachments: none in this concept demo");
  y -= 10;
  for (const line of assessment.lines) {
    if (y < 160) { page = document.addPage([612, 792]); y = 742; write(config.pdf.watermark, 10, true, blue); y -= 8; }
    write(`${line.category}: ${line.symptom}`, 11, true);
    write(`${line.unit ? `Approx. ${line.qty} ${line.unit}` : "Size to confirm"} | ${line.pricing === "inspection" ? "Inspection required" : "Illustrative scope"}`);
    for (const response of line.responses) write(`${response.label} ${response.answer}`, 9, false, muted);
    y -= 5;
  }
  if (y < 115) { page = document.addPage([612, 792]); y = 742; write(config.pdf.watermark, 10, true, blue); y -= 8; }
  write(config.pricing.disclaimer, 9, false, muted);
  return document.save();
}
