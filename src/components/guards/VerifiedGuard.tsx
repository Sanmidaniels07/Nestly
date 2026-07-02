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

export default function VerifiedGuard({
  children,
}: Props) {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isVerified,
  } = useAuth();

  useEffect(() => {
    if (
      isAuthenticated &&
      !isVerified &&
      user
    ) {
      router.replace(
        `/verify-email-sent?email=${encodeURIComponent(
          user.email
        )}`
      );
    }
  }, [
    isAuthenticated,
    isVerified,
    user,
    router,
  ]);

  if (
    isAuthenticated &&
    !isVerified
  ) {
    return null;
  }

  return children;
}