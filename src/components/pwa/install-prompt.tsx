"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Share, SquarePlus, X } from "lucide-react";

import NestlyMark from "@/src/components/ui/nestly-mark";
import { isIos, isStandalone, registerServiceWorker } from "@/src/lib/push";

// "Install Nestly" card for people using Nestly in a browser. On Android /
// Chrome it opens the browser's own install dialog; on iPhone (no install
// dialog exists) it shows how to Add to Home Screen. Hidden inside the
// installed app, and for a week after someone closes it.

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "nestly:install-dismissed";
const SNOOZE_DAYS = 7;
const SHOW_AFTER_MS = 4000;
// Full-screen pages where a card on top would get in the way.
const HIDDEN_ON = ["/live/", "/marketplace/live/", "/pay/", "/marketplace/checkout"];

const snoozed = () => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    return Date.now() - at < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

const snooze = () => {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Private mode - it just shows again next visit.
  }
};

// iPhone/iPad Safari only: other iPhone browsers can't add to the home screen.
const isIosSafari = () => isIos() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|Instagram|FBAN|FBAV/.test(navigator.userAgent);

export default function InstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [mode, setMode] = useState<"android" | "ios" | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    // Chrome only offers install once the site has a service worker.
    if ("serviceWorker" in navigator) registerServiceWorker().catch(() => {});

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
      setMode("android");
    };
    const onInstalled = () => {
      setOpen(false);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIosSafari()) timer = setTimeout(() => setMode("ios"), 0);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!mode || snoozed()) return;
    const timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [mode]);

  const hiddenHere = HIDDEN_ON.some((prefix) => pathname?.startsWith(prefix));
  if (!open || !mode || hiddenHere) return null;

  const close = () => {
    snooze();
    setOpen(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    // The event can only be used once.
    setInstallEvent(null);
    if (outcome === "dismissed") snooze();
    setOpen(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-3 sm:top-4">
      <div
        role="dialog"
        aria-label="Install Nestly"
        className="pointer-events-auto relative flex w-full max-w-md items-start gap-3.5 rounded-2xl border border-line bg-surface p-4 pr-11 shadow-[0_18px_48px_-12px_rgba(15,23,42,0.35)] live-pop"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/15">
          <NestlyMark size={30} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">Install Nestly</p>
          {mode === "android" ? (
            <>
              <p className="mt-0.5 text-[13.5px] leading-snug text-muted">Open it from your home screen like a normal app, with alerts for orders and messages.</p>
              <button
                type="button"
                onClick={install}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-violet-700"
              >
                <Download size={16} /> Install
              </button>
            </>
          ) : (
            <>
              <p className="mt-0.5 text-[13.5px] leading-snug text-muted">Add it to your home screen to open it like a normal app and get alerts.</p>
              <ol className="mt-2.5 space-y-1.5 text-[13px] text-ink">
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-2"><Share size={14} /></span>
                  Tap <strong className="font-semibold">Share</strong> in Safari&apos;s toolbar
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-2"><SquarePlus size={14} /></span>
                  Choose <strong className="font-semibold">Add to Home Screen</strong>
                </li>
              </ol>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-faint transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
