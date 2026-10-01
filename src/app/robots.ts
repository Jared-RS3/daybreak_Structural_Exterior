import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";

/**
 * Everything public is crawlable except the API (form endpoints, nothing to
 * read). The hero design variant is deliberately not disallowed: it carries a
 * noindex tag, and a crawler blocked from a page can't read that tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
