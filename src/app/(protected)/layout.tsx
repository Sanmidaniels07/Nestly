import { Suspense } from "react";

import AppShell
from "@/src/components/layout/app-shell";
import AuthGuard from "@/src/components/guards/AuthGuard";
import { NavigationTracker } from "@/src/hooks/use-go-back";
import type { Metadata } from "next";

// Everything in here needs an account - crawlers only ever see a login
// wall, so keep these pages out of search results (Phase 2 would open up
// product/store pages selectively).
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  // Don't inherit the home page's canonical - these aren't copies of it.
  alternates: { canonical: null },
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <NavigationTracker />
      </Suspense>
      <AppShell>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
