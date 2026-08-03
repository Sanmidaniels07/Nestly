"use client";

import {
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";

interface Props {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const hasSession = !!user && !!accessToken;

  useEffect(() => {
    if (isHydrated && !hasSession) {
      router.replace("/login");
    }
  }, [isHydrated, hasSession, router]);

  // AuthInitializer (mounted once at the app root) owns the actual session
  // check now — this guard just waits on its result, so it never has to
  // guess at auth state before it's known.
  if (!isHydrated || !hasSession) {
    return null;
  }

  return <>{children}</>;
}
