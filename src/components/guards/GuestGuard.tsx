"use client";

import {
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";
import Spinner from "@/src/components/ui/loader";

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

  // Same dotted loader as the app-wide loading screen, so pages behind this
  // guard (login, signup, features, preview...) don't sit blank while the
  // session check runs or the redirect to the dashboard happens.
  if (!isHydrated || isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-canvas">
        <Spinner size={32} />
      </div>
    );
  }

  return children;
}
