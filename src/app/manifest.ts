import type { MetadataRoute } from "next";
import { site } from "@/lib/seo";

/** Name, colours and icons for "Add to Home Screen" and the browser chrome. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Daybreak",
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#04090f",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
