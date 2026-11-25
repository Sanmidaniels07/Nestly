"use client";

import { useSyncExternalStore } from "react";

import { useAuthStore } from "@/src/store/auth-store";

const noop = () => () => {};

// "Good evening, Tola 👋" - by the viewer's own clock, so it's only worked
// out in the browser (the server's hour could be different). The name is in
// a slowly drifting violet -> pink -> rose gradient, shades picked to stay
// readable on both the light and the dark page (large text, 3:1+).
export default function Greeting() {
  const name = useAuthStore((state) => state.user?.name)?.trim().split(/\s+/)[0];
  const hour = useSyncExternalStore(noop, () => new Date().getHours(), () => -1);
  const part = hour < 0 ? "Welcome" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-w-0">
      <h1 className="font-[family-name:var(--font-fraunces)] text-[30px] leading-[1.1] tracking-tight text-ink sm:text-[38px]">
        {part}
        {name && (
          <>
            ,{" "}
            <span className="greeting-name bg-gradient-to-r from-violet-700 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent dark:from-violet-300 dark:via-fuchsia-300 dark:to-rose-300">
              {name}
            </span>
          </>
        )}{" "}
        <span className="greeting-wave" aria-hidden="true">
          👋
        </span>
      </h1>
      <p className="mt-1.5 text-[15.5px] text-ink-2 sm:text-[17px]">
        What are you{" "}
        <span className="font-semibold text-violet-700 underline decoration-fuchsia-400/60 decoration-wavy decoration-[1.5px] underline-offset-4 dark:text-violet-300 dark:decoration-fuchsia-300/60">
          shopping for
        </span>{" "}
        today?
      </p>
    </div>
  );
}
