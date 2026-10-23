import { Suspense } from "react";
import type { Metadata } from "next";

import ShopShell from "@/src/components/layout/shop-shell";
import { NavigationTracker } from "@/src/hooks/use-go-back";
import { isStaging } from "@/src/lib/environment";

// Product and store pages: open to everyone (buying still needs an
// account), so search engines can index them. Each page sets its own
// title, description, canonical and structured data.
export const metadata: Metadata = {
  robots: isStaging ? { index: false, follow: false } : { index: true, follow: true },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationTracker />
      </Suspense>
      <ShopShell>{children}</ShopShell>
    </>
  );
}
