import { SUPPORT_WHATSAPP } from "./support";

// Canonical public address used in metadata, the sitemap and structured data.
// Staging overrides it (NEXT_PUBLIC_SITE_URL) but is never indexed anyway.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.nestlyapp.site").replace(/\/+$/, "");

export const SITE_NAME = "Nestly";

export const SITE_TAGLINE = "Connect, celebrate and shop together";

export const SITE_DESCRIPTION =
  "Nestly is the social marketplace for your people, your moments and sellers you trust. Follow friends, never miss a birthday, join communities, and shop from local sellers with secure Paystack checkout and delivery-code protection.";

/** Link-preview image. Page-level openGraph replaces (not merges) the root's, so pages re-use this. */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} – ${SITE_TAGLINE}` };

/** Public, indexable pages - everything else needs an account. */
export const PUBLIC_ROUTES = ["/", "/features", "/preview", "/signup", "/login", "/terms", "/privacy", "/seller-terms", "/guides", "/guides/sellers", "/guides/buyers", "/guides/community"] as const;

// schema.org data so search engines know who's behind the site.
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      description: SITE_DESCRIPTION,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `https://wa.me/${SUPPORT_WHATSAPP}`,
        areaServed: "NG",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-NG",
    },
  ],
};
