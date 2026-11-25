import { redirect } from "next/navigation";

import { featureOn } from "@/src/lib/features";

// Switched off for now (see src/lib/features.ts): old links go to the marketplace.
export default function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  if (!featureOn.communities) redirect("/marketplace");
  return children;
}
