import { redirect } from "next/navigation";

import { featureOn } from "@/src/lib/features";

// Switched off for now (see src/lib/features.ts): old links go to the marketplace.
export default function EventsLayout({ children }: { children: React.ReactNode }) {
  if (!featureOn.events) redirect("/marketplace");
  return children;
}
