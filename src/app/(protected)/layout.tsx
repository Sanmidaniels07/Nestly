import { Suspense } from "react";

import AppShell
from "@/src/components/layout/app-shell";
import AuthGuard from "@/src/components/guards/AuthGuard";
import { NavigationTracker } from "@/src/hooks/use-go-back";

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
