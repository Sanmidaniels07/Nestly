"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Share2, X } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import ShareStoreCard from "./share-store-card";

// Short, so the five sections sit near the top of the screen - with Share
// right by the store's name, since sharing the link is how sellers bring
// buyers in. It opens the same "Share your store" options as on Home.
export default function SellerDashboardHeader() {
  const { data: seller } = useMySeller();
  const [sharing, setSharing] = useState(false);
  const canShare = seller?.status === "APPROVED" && !!seller.store && !seller.store.isSuspended;

  return (
    <section className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Seller Hub
        </p>
        <h1 className="mt-1 truncate font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink sm:text-[36px]">
          {seller?.store?.name ?? "Your shop"}
        </h1>
      </div>
      {canShare && (
        <button
          type="button"
          onClick={() => setSharing(true)}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-[14px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(91,33,182,0.7)] transition hover:brightness-110 active:scale-[0.98]"
        >
          <Share2 size={17} /> Share
        </button>
      )}
      {sharing && <ShareSheet onClose={() => setSharing(false)} />}
    </section>
  );
}

function ShareSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Keep the page behind still while the sheet is open.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share your store"
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-canvas pb-[env(safe-area-inset-bottom)] shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-muted shadow-sm hover:text-ink"
        >
          <X size={18} />
        </button>
        <ShareStoreCard />
      </div>
    </div>,
    document.body
  );
}
