"use client";

import { Bell, BellRing } from "lucide-react";

import { useMyStockAlerts, useToggleStockAlert } from "@/src/hooks/use-stock-alerts";
import { useRequireLogin, useSession } from "@/src/hooks/use-session";

// Sold out (the whole product, or the chosen option): ask to be told when
// it's back. The alert comes as a "Shopping updates" notification + email.
export default function NotifyMe({ productId, variationId }: { productId: string; variationId?: string }) {
  const { isLoggedIn } = useSession();
  const requireLogin = useRequireLogin();
  const { data: watched } = useMyStockAlerts(productId, isLoggedIn);
  const { mutate: toggle, isPending } = useToggleStockAlert(productId);

  const watching = !!watched?.includes(variationId ?? null);

  const onClick = () => {
    if (!requireLogin("Log in or create a free account to get told when it's back in stock.")) return;
    toggle({ watching, input: { productId, variationId } });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-semibold transition-colors disabled:opacity-60 ${
        watching
          ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110"
      }`}
    >
      {watching ? <BellRing size={16} /> : <Bell size={16} />}
      {watching ? "We'll tell you when it's back" : "Notify me when it's back"}
    </button>
  );
}
