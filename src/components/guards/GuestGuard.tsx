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
    isVerified,
    user,
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
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
    isAuthenticated,
    isVerified,
    user,
    router,
  ]);

  if (isAuthenticated) {
    return null;
  }

  return children;
}