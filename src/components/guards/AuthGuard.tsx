"use client";

import {
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { refreshSession } from "@/src/services/session.services";
import { getProfile } from "@/src/services/profile.services";

interface Props {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const [checking, setChecking] = useState(true);
  const hasSession = !!user && !!accessToken;

  useEffect(() => {
    // Already authenticated in memory (e.g. logged in earlier this tab, or
    // navigating between protected pages) — skip the network round trip.
    if (hasSession) {
      setChecking(false);
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
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Runs once per mount — re-checking is driven by hasSession, not deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checking && !hasSession) {
      router.replace("/login");
    }
  }, [checking, hasSession, router]);

  if (checking || !hasSession) {
    return null;
  }

  return <>{children}</>;
}
