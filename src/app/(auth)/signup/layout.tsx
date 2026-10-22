import type { Metadata } from "next";

import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Create your free account",
  description:
    "Join Nestly free: connect with friends, never miss a birthday, join communities, and shop from or sell to people you know.",
  alternates: { canonical: "/signup" },
  openGraph: { title: "Join Nestly – it's free", url: "/signup", images: [OG_IMAGE] },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
