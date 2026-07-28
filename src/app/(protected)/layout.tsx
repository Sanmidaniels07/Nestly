import AppShell
from "@/src/components/layout/app-shell";
import AuthGuard from "@/src/components/guards/AuthGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>
        {children}
      </AppShell>
    </AuthGuard>
  );
}