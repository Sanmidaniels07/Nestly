"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/src/store/auth-store";
import { refreshSession } from "@/src/services/session.services";
import { getProfile } from "@/src/services/profile.services";

// Runs once for the whole app (mounted in Providers, above Navbar and every
// route) and resolves whether there's a valid session before anything that
// branches on auth state — Navbar, AuthGuard, GuestGuard — is allowed to
// commit to rendering either the signed-in or signed-out UI.
export default function AuthInitializer() {
  const hasSession = useAuthStore(
    (state) => !!state.user && !!state.accessToken
  );
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Already resolved this tab (e.g. just logged in) — nothing to check.
    if (hasSession) {
      setHydrated();
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        // The refresh token lives in an httpOnly cookie, so this call needs
        // no arguments — the browser attaches it automatically.
        const refreshed = await refreshSession();
        if (cancelled) return;

        // Set the access token before fetching the profile so the request
        // interceptor can attach it — otherwise this call would 401 and
        // trigger a second, redundant refresh via the interceptor itself.
        setAccessToken(refreshed.data.accessToken);

        const profile = await getProfile();
        if (cancelled) return;

        setUser({
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.email,
          role: profile.data.role,
          isVerified: profile.data.isVerified,
        });
      } catch {
        if (!cancelled) logout();
      } finally {
        if (!cancelled) setHydrated();
      }
    })();

    return () => {
      cancelled = true;
    };
    // Deliberately runs once per app load — re-checking is driven by
    // explicit auth actions (login/logout), not by this effect's deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
