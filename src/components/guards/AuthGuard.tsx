"use client";

import {
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";

interface Props {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const router = useRouter();

  const {
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [
    isAuthenticated,
    router,
  ]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}