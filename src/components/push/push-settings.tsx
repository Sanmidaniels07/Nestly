"use client";

import { BellOff, BellRing, Share, Smartphone } from "lucide-react";

import { usePush } from "@/src/hooks/use-push";
import Button from "@/src/components/ui/button";
import Skeleton from "@/src/components/ui/skeleton";

// "Push notifications on this device" in Settings → Notifications. Which
// alerts arrive is still controlled by the preferences below it.
export default function PushSettings() {
  const { state, busy, turnOn, turnOff, test } = usePush();

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <Smartphone size={17} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-ink">Push notifications on this device</h3>
          <p className="mt-1 text-[13px] text-muted">
            Alerts on your phone or computer when Nestly isn&apos;t open. Turn it on separately on each device you use.
          </p>
        </div>
      </div>

      <div className="mt-4">
        {state === null && <Skeleton className="h-11 w-48 rounded-xl" />}

        {state === "on" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex items-center gap-1.5 text-[13.5px] font-medium text-emerald-700 dark:text-emerald-400">
              <BellRing size={16} /> On for this device
            </p>
            <div className="flex gap-2 sm:ml-auto">
              <Button variant="outline" onClick={() => test()} disabled={busy} className="h-10 rounded-xl px-4">
                Send a test
              </Button>
              <Button variant="outline" onClick={() => turnOff()} disabled={busy} className="h-10 rounded-xl px-4">
                Turn off
              </Button>
            </div>
          </div>
        )}

        {state === "off" && (
          <Button variant="tribely" onClick={() => turnOn()} loading={busy} className="h-11 rounded-xl px-6">
            Turn on notifications
          </Button>
        )}

        {state === "blocked" && (
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
            <BellOff size={16} className="mt-0.5 shrink-0" />
            Notifications are blocked for Nestly in this browser. Allow them in the browser&apos;s site settings (the icon
            left of the web address), then come back here.
          </p>
        )}

        {state === "needs-home-screen" && (
          <p className="rounded-xl bg-surface-2 px-4 py-3 text-[13px] leading-relaxed text-ink-3">
            On iPhone and iPad, notifications work once Nestly is on your Home Screen: tap{" "}
            <Share size={13} className="inline -translate-y-px" aria-label="Share" /> <strong>Share</strong>, then{" "}
            <strong>Add to Home Screen</strong>, open Nestly from there and turn them on here. (Needs iOS 16.4 or newer.)
          </p>
        )}

        {state === "unsupported" && (
          <p className="text-[13px] text-muted">This browser doesn&apos;t support notifications. Try Chrome, Edge, Firefox or Safari.</p>
        )}

        {state === "unavailable" && (
          <p className="text-[13px] text-muted">Push notifications aren&apos;t available right now. Please check back soon.</p>
        )}
      </div>
    </section>
  );
}
