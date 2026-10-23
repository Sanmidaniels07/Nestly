"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { rememberPath } from "@/src/lib/return-path";
import { forgetReturnTo, getSafeReturnTo } from "@/src/lib/return-to";
import { useAuthStore } from "@/src/store/auth-store";

// Records each page visited (see lib/return-path). Renders nothing.
export default function RouteMemory() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isHydrated && !!state.user && !!state.accessToken);

  useEffect(() => {
    rememberPath(`${pathname}${window.location.search}`);
  }, [pathname]);

  // The page a guest left to sign up (lib/return-to) has done its job once
  // they're signed in and past the auth pages - don't reuse it later.
  useEffect(() => {
    if (isLoggedIn && getSafeReturnTo(pathname)) forgetReturnTo();
  }, [isLoggedIn, pathname]);

  return null;
}
