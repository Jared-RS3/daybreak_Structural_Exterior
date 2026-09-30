import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 made `images.qualities` an allowlist that defaults to [75], and
    // silently coerces anything else to the nearest allowed value. `Img`
    // (components/ui/Img.tsx) asks for 82 — without this every photo on both
    // properties was being served at 75 instead. 92 is the hero photograph
    // alone: it is the LCP image on the agency site and the one place where
    // shingle texture and a graded sky are worth the extra kilobytes.
    qualities: [75, 82, 92],
    // The hero photograph is 1536px wide. Without a 1536 bucket the browser
    // asks for 1920 on a wide screen and Next upscales — a bigger LCP file
    // carrying no extra detail. This adds the bucket the asset actually has.
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 3840],
  },
};

export default nextConfig;
