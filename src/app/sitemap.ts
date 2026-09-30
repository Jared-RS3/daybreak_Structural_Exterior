import type { MetadataRoute } from "next";

/**
 * Only the agency site is listed. The contractor reference build under /work is
 * excluded deliberately: the contractor in it is fictional, and asking search
 * engines to index a business that does not exist would put it into local
 * results. It stays crawlable (so its noindex is actually seen) but unlisted.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    /* Listed rather than hidden. These are the pages a visitor goes looking for
       when they want to know what happens to their data, and a policy that is
       hard to find reads as one that is trying not to be read. */
    { url: "/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "/terms", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "/accessibility", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
