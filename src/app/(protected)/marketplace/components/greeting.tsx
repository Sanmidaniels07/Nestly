"use client";

import { useSyncExternalStore } from "react";

import { useAuthStore } from "@/src/store/auth-store";

const noop = () => () => {};

// "Good evening, Tola" - by the viewer's own clock, so it's only worked out
// in the browser (the server's hour could be different).
export default function Greeting() {
  const name = useAuthStore((state) => state.user?.name)?.trim().split(/\s+/)[0];
  const hour = useSyncExternalStore(noop, () => new Date().getHours(), () => -1);
  const part = hour < 0 ? "Welcome" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-w-0">
      <p className="truncate font-[family-name:var(--font-fraunces)] text-[22px] leading-tight text-ink sm:text-[26px]">
        {part}
        {name ? `, ${name}` : ""}
      </p>
      <p className="text-[13px] text-muted">What are you shopping for today?</p>
    </div>
  );
}
