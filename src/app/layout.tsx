import Navbar from "../components/ui/navbar";
import "./globals.css";
import Providers from "./providers";
import { fraunces, jakarta, jetbrainsMono } from "@/src/lib/fonts";
import AppToaster from "../components/ui/toaster";
import { isStaging } from "../lib/environment";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, organizationJsonLd } from "../lib/site";
import type { Metadata, Viewport } from "next";

// Site-wide SEO defaults. Pages override the title (template adds
// "· Nestly"); icon.png / apple-icon.png in this folder become the favicons.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Nestly",
    "social marketplace",
    "Nigeria marketplace",
    "buy and sell online Nigeria",
    "sell on WhatsApp alternative",
    "online store Nigeria",
    "birthday reminders",
    "communities",
    "Paystack checkout",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_NG",
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} – ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
  // Staging pages carry noindex as well as robots.txt disallowing them, so a
  // shared staging link can't end up in search results.
  robots: isStaging ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          <Navbar/>
          {children}
        </Providers>
        <AppToaster />
      </body>
    </html>
  );
}
