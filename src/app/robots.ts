import type { MetadataRoute } from "next";

/**
 * Nothing is disallowed. /work carries `robots: { index: false }` instead —
 * blocking it here would stop crawlers fetching the page, which means they
 * would never read the noindex and the URL could still surface.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "/sitemap.xml",
  };
}
