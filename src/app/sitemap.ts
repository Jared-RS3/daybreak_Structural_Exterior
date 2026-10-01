import type { MetadataRoute } from "next";
import { founders } from "@/lib/agency";
import { automationFilm } from "@/lib/daybreak";
import { houseImage } from "@/lib/demo-site";
import { absoluteUrl } from "@/lib/seo";

/**
 * The agency site's pages. Sitemap URLs must be absolute — crawlers don't
 * resolve them against anything — so every one goes through absoluteUrl().
 *
 * `lastModified` is the date a page last changed in substance, not the build
 * time: a date that moves on every deploy teaches Google to ignore it. Bump a
 * page's date when its content changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: "2026-10-01",
      changeFrequency: "weekly",
      priority: 1,
      images: [houseImage.src, ...founders.map((f) => f.portrait)].map((src) => absoluteUrl(src)),
      videos: [
        {
          title: automationFilm.title,
          description: automationFilm.description,
          thumbnail_loc: absoluteUrl(automationFilm.poster),
          content_loc: absoluteUrl(automationFilm.src),
          duration: automationFilm.seconds,
          publication_date: automationFilm.uploaded,
          family_friendly: "yes",
        },
      ],
    },
    /* Listed rather than hidden. These are the pages a visitor goes looking for
       when they want to know what happens to their data, and a policy that is
       hard to find reads as one that is trying not to be read. */
    { url: absoluteUrl("/privacy"), lastModified: "2026-09-30", changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: "2026-09-30", changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/accessibility"), lastModified: "2026-09-30", changeFrequency: "yearly", priority: 0.3 },
  ];
}
