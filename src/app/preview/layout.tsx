import type { Metadata } from "next";

import { OG_IMAGE } from "@/src/lib/site";

// The page itself is a client component, so its SEO lives here.
export const metadata: Metadata = {
  title: "See how Nestly works",
  description:
    "A quick look inside Nestly: share moments with friends, join communities, celebrate birthdays, and buy from sellers you know with tracked delivery.",
  alternates: { canonical: "/preview" },
  openGraph: { title: "See how Nestly works", url: "/preview", images: [OG_IMAGE] },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
