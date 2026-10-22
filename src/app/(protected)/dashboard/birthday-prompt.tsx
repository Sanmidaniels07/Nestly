"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cake, X } from "lucide-react";

const DISMISS_KEY = "nestly.birthdayPrompt.dismissed";

interface Props {
  /** The signed-in user's own date of birth (null/undefined = not set). */
  dateOfBirth: string | null | undefined;
}

// Nudges people who haven't added a birthday (most existing users signed up
// before it was asked) - their followers can't celebrate them otherwise.
export default function BirthdayPrompt({ dateOfBirth }: Props) {
  // Hidden until we've read the dismissal flag, so it never flashes.
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dateOfBirth || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage unavailable (private mode) - it just shows again next visit.
    }
  };

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 via-surface to-violet-50 p-5 pr-12 dark:border-pink-500/25 dark:from-pink-500/10 dark:via-surface dark:to-violet-500/10 sm:flex-row sm:items-center sm:p-6 sm:pr-14">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-violet-500 text-white shadow-[0_10px_24px_-10px_rgba(219,39,119,0.6)]">
        <Cake size={22} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">When&apos;s your birthday? 🎂</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Add it so the people who follow you get a reminder to celebrate you. Only the day is shared — your age stays private.
        </p>
      </div>

      <Link
        href="/settings/profile"
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110"
      >
        Add birthday
      </Link>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-subtle transition hover:bg-surface-2 hover:text-ink"
      >
        <X size={16} />
      </button>
    </div>
  );
}
