import type { Metadata } from "next";

import { OG_IMAGE } from "@/src/lib/site";

// The page itself is a client component, so its SEO lives here.
export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything in Nestly: a social feed, communities, birthday reminders, events, messages, and a marketplace with secure Paystack checkout, delivery zones, free pickup and delivery-code protection.",
  alternates: { canonical: "/features" },
  openGraph: { title: "Nestly features", url: "/features", images: [OG_IMAGE] },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
