import { site, siteUrl } from "@/lib/seo";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The source of the link preview every page shares (iMessage, WhatsApp,
 * LinkedIn, Facebook, X, Slack): the homepage's sky, its headline and its
 * house, so a shared link looks like the site it opens.
 *
 * What ships is the JPEG this renders, public/og-image.jpg, wired up in
 * lib/seo.ts (`shareImage`). A rendered PNG of a photograph is ~430 KB;
 * WhatsApp drops previews above roughly 300 KB, and contractors share links
 * there more than anywhere. The JPEG is ~160 KB.
 *
 * To change the image: move this file to app/opengraph-image.tsx, run
 * `next dev`, open /opengraph-image, save it as JPEG (quality ~85) over
 * public/og-image.jpg, and move this file back. Update `shareImage.alt` in
 * lib/seo.ts if the words change.
 *
 * The renderer can't read WOFF2, variable fonts or WebP, so app/_og holds
 * static TTF cuts of the site's two faces (Manrope for headlines, Geist Mono
 * for labels) and a PNG of the hero house.
 */
export const alt =
  "Daybreak Structure-Works: websites that book foundation, crawl space and siding jobs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dir = join(process.cwd(), "src/app/_og");

export default async function Image() {
  const [manrope, mono, house] = await Promise.all([
    readFile(join(dir, "Manrope-Medium.ttf")),
    readFile(join(dir, "GeistMono-Medium.ttf")),
    readFile(join(dir, "house.png")),
  ]);
  const houseSrc = `data:image/png;base64,${house.toString("base64")}`;
  const domain = new URL(siteUrl).host;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background:
          "linear-gradient(180deg, #33658b 0%, #3f7aa2 55%, #8fb8d3 100%)",
        fontFamily: "Manrope",
        color: "#ffffff",
      }}
    >
      {/* The house stands in the sky on the right, as in the hero. */}
      {/* Satori renders plain <img>; next/image doesn't apply here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={houseSrc}
        width={580}
        height={406}
        style={{ position: "absolute", right: -70, bottom: -30 }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          width: 660,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path d="M5 16a7 7 0 0 1 14 0Z" fill="#fcc600" />
            <path
              d="M2.5 19h19"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: 34, letterSpacing: "-0.03em" }}>
            {site.name}
          </span>
        </div>

        <div
          style={{
            marginTop: 64,
            fontSize: 60,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
          }}
        >
          Websites that book foundation, crawl space & siding jobs.
        </div>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Geist Mono",
            fontSize: 20,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 10, height: 10, background: "#fcc600" }} />
          Free homepage concept on your first call
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 48,
          fontFamily: "Geist Mono",
          fontSize: 20,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        {domain}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Manrope", data: manrope, style: "normal", weight: 500 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
