import type { MetadataRoute } from "next";

import { isStaging } from "../lib/environment";

// Staging must never show up in search results; production stays crawlable.
export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return { rules: { userAgent: "*", allow: "/" } };
}
