import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "../lib/site";

// Lets phones "Add to home screen" with the Nestly name, icon and colours.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F5F7FA",
    theme_color: "#7C3AED",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
