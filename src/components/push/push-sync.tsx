"use client";

import { useEffect, useRef } from "react";

import { useAuthStore } from "@/src/store/auth-store";
import { disablePush, syncPush } from "@/src/lib/push";

// Keeps this device's push notifications tied to whoever is signed in:
// after sign-in it re-links the device (if notifications were allowed
// before), and when the session ends it stops pushes to this device.
// Renders nothing.
export default function PushSync() {
  const userId = useAuthStore((state) => (state.isHydrated && state.accessToken ? state.user?.id ?? null : null));
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (userId && userId !== previous.current) syncPush();
    // Signed out (explicitly or the session expired).
    if (!userId && previous.current) disablePush({ tellServer: false });
    previous.current = userId;
  }, [userId, isHydrated]);

  return null;
}
