"use client";

import {
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";

interface Props {
  children: ReactNode;
}

export default function GuestGuard({
  children,
}: Props) {
  const router = useRouter();

  const {
    isAuthenticated,
    isHydrated,
    isVerified,
    user,
  } = useAuth();

  useEffect(() => {
    // Wait for the initial session check (see AuthInitializer) — deciding
    // "guest" before it resolves is what caused this guard to flash a
    // signed-in-looking page for a split second on every hard refresh.
    if (!isHydrated || !isAuthenticated) {
      return;
    }

    if (
      !isVerified &&
      user
    ) {
      router.replace(
        `/verify-email-sent?email=${encodeURIComponent(
          user.email
        )}`
      );

      return;
    }

    router.replace(
      "/dashboard"
    );
  }, [
    isHydrated,
    isAuthenticated,
    isVerified,
    user,
    router,
  ]);

  if (!isHydrated || isAuthenticated) {
    return null;
  }

  return children;
}
