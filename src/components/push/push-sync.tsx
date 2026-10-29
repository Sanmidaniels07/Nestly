"use client";

import { useEffect, useRef } from "react";

import { useAuthStore } from "@/src/store/auth-store";
import { disablePush, setAppIconBadge, syncPush } from "@/src/lib/push";
import { useUnreadNotificationsCount } from "@/src/hooks/use-unread-notifications-count";

// Keeps this device's push notifications tied to whoever is signed in:
// after sign-in it re-links the device (if notifications were allowed
// before), and when the session ends it stops pushes to this device.
// Also keeps the unread number on the installed app's icon in step with
// the bell. Renders nothing.
export default function PushSync() {
  const userId = useAuthStore((state) => (state.isHydrated && state.accessToken ? state.user?.id ?? null : null));
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const previous = useRef<string | null>(null);
  const { count: unread, isLoading } = useUnreadNotificationsCount({ enabled: !!userId });

  useEffect(() => {
    if (!isHydrated) return;
    if (userId && userId !== previous.current) syncPush();
    // Signed out (explicitly or the session expired).
    if (!userId && previous.current) {
      disablePush({ tellServer: false });
      setAppIconBadge(0);
    }
    previous.current = userId;
  }, [userId, isHydrated]);

  useEffect(() => {
    if (userId && !isLoading) setAppIconBadge(unread);
  }, [userId, unread, isLoading]);

  return null;
}
