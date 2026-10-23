"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { useSession } from "@/src/hooks/use-session";
import { rememberReturnTo } from "@/src/lib/return-to";
import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";
import MessageSocketListener from "./message-socket-listener";

// Frame for pages anyone can open (product and store pages). Signed-in
// users get the usual app shell; guests get the page with a sign-up nudge.
// The tree keeps the same shape either way, so the page content isn't
// remounted once the session check finishes.
export default function ShopShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isHydrated } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas via-canvas-via to-canvas-to">
      {isLoggedIn && <MessageSocketListener />}
      {isLoggedIn && <Sidebar />}

      <main
        className={`min-h-screen px-4 pt-20 sm:px-6 lg:px-8 ${isLoggedIn ? "pb-24 lg:ml-[264px] lg:pb-8" : "pb-12"}`}
      >
        {isHydrated && !isLoggedIn && <GuestBanner />}
        {children}
      </main>

      {isLoggedIn && <MobileNav />}
    </div>
  );
}

function GuestBanner() {
  // Back to this product or store after logging in (or signing up first).
  const pathname = usePathname();
  const returnTo = encodeURIComponent(pathname);
  const remember = () => rememberReturnTo(pathname);

  return (
    <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5 dark:border-violet-500/30 dark:bg-violet-500/10">
      <ShieldCheck size={20} className="hidden shrink-0 text-violet-600 sm:block dark:text-violet-400" />
      <p className="flex-1 text-[13.5px] leading-snug text-ink-2">
        <span className="font-semibold text-ink">Shop from sellers you can trust.</span> Join Nestly free to buy with secure Paystack
        checkout, follow stores and get delivery-code protection.
      </p>
      <div className="flex shrink-0 gap-2">
        <Link
          href={`/login?returnTo=${returnTo}`}
          onClick={remember}
          className="flex h-10 flex-1 items-center justify-center rounded-xl border border-line-strong bg-surface px-4 text-[13px] font-semibold text-ink-2 sm:flex-none"
        >
          Log in
        </Link>
        <Link
          href={`/signup?returnTo=${returnTo}`}
          onClick={remember}
          className="flex h-10 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-[13px] font-semibold text-white sm:flex-none"
        >
          Join free
        </Link>
      </div>
    </div>
  );
}
