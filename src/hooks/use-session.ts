"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/auth-store";
import { rememberReturnTo } from "../lib/return-to";

// Who's looking at a page that guests can open too (product and store
// pages). isLoggedIn stays false until the session check has finished.
export const useSession = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return { user, isHydrated, isLoggedIn: isHydrated && !!user && !!accessToken };
};

// For actions that need an account (add to cart, follow, message): returns
// true when signed in, otherwise sends the guest to log in and come back
// here afterwards.
export const useRequireLogin = () => {
  const { isLoggedIn } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (reason = "Log in or create a free account to continue.") => {
      if (isLoggedIn) return true;
      toast(reason, { icon: "👋" });
      const returnTo = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;
      rememberReturnTo(returnTo);
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return false;
    },
    [isLoggedIn, pathname, router]
  );
};
