"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Mail, RotateCcw, X } from "lucide-react";

import { useClaimGuestAccount } from "@/src/hooks/use-payment-links";
import { rememberReturnTo } from "@/src/lib/return-to";
import { orderReference, supportWhatsAppUrl } from "@/src/lib/support";
import { WhatsAppIcon } from "@/src/components/ui/social-icons";
import { GuestOrder } from "@/src/types/payment-link";

export type GuestHelpMode = "return" | "problem";

interface Props {
  order: GuestOrder;
  token: string;
  item: { id: string; title: string };
  mode: GuestHelpMode;
  onClose: () => void;
}

// A guest wants to ask for a return or report a problem. That runs through
// a Nestly account (the seller replies, Nestly steps in if needed), so they
// set one up here - or log in - and land straight on the return form for
// this item. Or they message Nestly Support on WhatsApp instead.
export default function GuestHelpDialog({ order, token, item, mode, onClose }: Props) {
  const router = useRouter();
  const { mutate: claim, isPending, data: result } = useClaimGuestAccount(token);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Where they continue once signed in: this item's return form.
  const target = `/marketplace/orders/${order.id}?item=${encodeURIComponent(item.id)}&action=${mode}`;
  const loginHref = `/login?returnTo=${encodeURIComponent(target)}`;
  const isReturn = mode === "return";

  useEffect(() => {
    // Portals need the document, so this waits for the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!mounted) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError("Use at least 6 characters.");
    setError("");
    claim(password, {
      // Signed in straight away: on to the return form.
      onSuccess: (response) => {
        if (!response.data.emailSent) router.push(target);
        // Password email: logging in after it lands on the return form.
        else rememberReturnTo(target);
      },
    });
  };

  const whatsappMessage = `Hi Nestly, I need help with order ${orderReference(order.id)} - "${item.title}". I'd like to ${
    isReturn ? "return it" : "report a problem with it"
  }: `;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-help-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              {isReturn ? <RotateCcw size={18} /> : <AlertTriangle size={18} />}
            </div>
            <div className="min-w-0">
              <h2 id="guest-help-title" className="text-[16px] font-semibold text-ink">
                {isReturn ? "Request a return" : "Report a problem"}
              </h2>
              <p className="mt-0.5 truncate text-[12.5px] text-muted">{item.title}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-ink-2">
          {isReturn ? "Returns" : "Problem reports"} go through a free Nestly account, so the seller can reply and Nestly can step in if
          needed. Set it up or log in - we&apos;ll bring you straight back to {isReturn ? "your return" : "your report"}.
        </p>

        {result?.data.emailSent ? (
          <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/30 dark:bg-violet-500/10">
            <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <Mail size={16} className="text-violet-600 dark:text-violet-300" /> Check your email
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
              You&apos;ve ordered with this email before, so we sent a link to <strong className="text-ink-2">{result.data.email}</strong> to set
              your password. Open it on this phone and log in - you&apos;ll land on {isReturn ? "your return" : "your report"}.
            </p>
          </div>
        ) : order.buyer.isGuest ? (
          <form onSubmit={submit} className="mt-4 space-y-2.5">
            <label htmlFor="guest-help-password" className="text-[12.5px] font-medium text-ink-2">
              Choose a password for {order.buyer.email}
            </label>
            <input
              id="guest-help-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Choose a password"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
            />
            {error && <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13.5px] font-semibold text-white hover:brightness-110 disabled:opacity-70"
            >
              {isPending && <Loader2 size={15} className="animate-spin" />}
              Create account and continue
            </button>
            <p className="text-[12px] text-muted">
              Already have a password, or prefer Google?{" "}
              <Link href={loginHref} onClick={() => rememberReturnTo(target)} className="font-semibold text-violet-700 hover:underline dark:text-violet-300">
                Log in
              </Link>
            </p>
          </form>
        ) : (
          <Link
            href={loginHref}
            onClick={() => rememberReturnTo(target)}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13.5px] font-semibold text-white hover:brightness-110"
          >
            Log in to continue
          </Link>
        )}

        <div className="my-4 flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-wide text-subtle">
          <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
        </div>

        <a
          href={supportWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line text-[13.5px] font-semibold text-ink-2 transition-colors hover:bg-surface-sunken"
        >
          <WhatsAppIcon size={16} className="text-emerald-600" /> Message Nestly on WhatsApp
        </a>
        <p className="mt-2 text-center text-[11.5px] text-subtle">We&apos;ll help you without an account. Your order number is included.</p>
      </div>
    </div>,
    document.body
  );
}
