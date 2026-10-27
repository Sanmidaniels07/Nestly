"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AtSign, Cake, Camera, CheckCircle2, ChevronRight, MapPin, PenLine, Sparkles, X } from "lucide-react";

import { ProfileSetupStep, ProfileSetupStepKey } from "@/src/types/profile";

const HIDE_KEY = "nestly.profileChecklist.hiddenAt";
const HIDE_FOR_MS = 7 * 24 * 60 * 60 * 1000;

const ICONS: Record<ProfileSetupStepKey, typeof AtSign> = {
  USERNAME: AtSign,
  PHOTO: Camera,
  BIRTHDAY: Cake,
  BIO: PenLine,
  ADDRESS: MapPin,
};

const subscribeNoop = () => () => {};

const isHidden = () => {
  try {
    const at = Number(localStorage.getItem(HIDE_KEY));
    return !!at && Date.now() - at < HIDE_FOR_MS;
  } catch {
    return false;
  }
};

// "Add a profile photo" -> "Profile photo".
const doneLabel = (title: string) => {
  const label = title.replace(/^(Choose|Add|Write|Save) (a |an |your )?/i, "");
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// "Finish your profile" - what's left after signing up (Google sign-ups only
// bring a name, email and photo). Gone once everything is done; "Hide"
// tucks it away for a week.
export default function ProfileChecklist({ steps }: { steps: ProfileSetupStep[] }) {
  // The hide flag lives in this browser, so it's only read on the client -
  // the server render (and hydration) shows nothing, so it never flashes.
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [hiddenNow, setHiddenNow] = useState(false);
  // Opened from the reminder notification - show it even if hidden.
  const requested = useSearchParams().get("checklist") === "1";

  const done = steps.filter((step) => step.done).length;
  if (!isClient || hiddenNow || (!requested && isHidden()) || steps.length === 0 || done === steps.length) return null;

  const hide = () => {
    setHiddenNow(true);
    try {
      localStorage.setItem(HIDE_KEY, String(Date.now()));
    } catch {
      // Storage unavailable (private mode) - it just shows again next visit.
    }
  };

  const todo = steps.filter((step) => !step.done);
  const percent = Math.round((done / steps.length) * 100);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-surface to-pink-50 p-5 dark:border-violet-500/25 dark:from-violet-500/10 dark:via-surface dark:to-pink-500/10 sm:p-6">
      <button
        onClick={hide}
        aria-label="Hide for now"
        title="Hide for a week"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-subtle transition hover:bg-surface-2 hover:text-ink"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3.5 pr-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-[0_10px_24px_-10px_rgba(124,58,237,0.6)]">
          <Sparkles size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">Finish setting up your profile</p>
          <p className="mt-0.5 text-[13px] text-muted">
            {done} of {steps.length} done · each takes less than a minute
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-500/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all"
              style={{ width: `${Math.max(percent, 4)}%` }}
            />
          </div>
        </div>
      </div>

      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {todo.map((step) => {
          const Icon = ICONS[step.key];
          return (
            <li key={step.key}>
              <Link
                href={step.path}
                className="group flex h-full items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
              >
                <Icon size={17} className="shrink-0 text-violet-600 dark:text-violet-400" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold text-ink">{step.title}</span>
                  <span className="block text-[12px] leading-snug text-muted">{step.why}</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>

      {done > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
          {steps
            .filter((step) => step.done)
            .map((step) => (
              <span key={step.key} className="inline-flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {doneLabel(step.title)}
              </span>
            ))}
        </p>
      )}
    </section>
  );
}
