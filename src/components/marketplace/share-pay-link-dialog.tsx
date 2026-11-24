"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ExternalLink, Loader2, ShieldCheck, X } from "lucide-react";

import { useProductPayLink } from "@/src/hooks/use-payment-links";
import ShareLink from "@/src/app/(protected)/settings/marketplace/components/payment-links/share-link";
import { PaymentLink } from "@/src/types/payment-link";

interface Props {
  productId: string;
  productTitle: string;
  onClose: () => void;
}

// "Share pay link" on a product in the shop: gets (or makes) the product's
// pay link and shows it ready to send. Buyers who open it pay for the
// listing straight away, without making an account.
export default function SharePayLinkDialog({ productId, productTitle, onClose }: Props) {
  const { mutate: getLink, isPending, error } = useProductPayLink();
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Portals need the document, so this waits for the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    getLink(productId, { onSuccess: (response) => setLink(response.data) });
  }, [getLink, productId]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!mounted) return null;

  const message = error?.response?.data?.message ?? (error ? "Couldn't get the pay link. Try again." : null);
  const needsDelivery = !!message && /delivery zones/i.test(message);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-link-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <ShieldCheck size={19} />
            </div>
            <div className="min-w-0">
              <h2 id="pay-link-title" className="text-[16px] font-semibold text-ink">
                Share pay link
              </h2>
              <p className="mt-0.5 truncate text-[12.5px] text-muted">{productTitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-ink-2">
          Send this in WhatsApp, Instagram or your bio. Buyers see the product and pay straight away - no account needed. Their money is held until
          they get it.
        </p>

        <div className="mt-4">
          {isPending || (!link && !message) ? (
            <div className="flex h-24 items-center justify-center rounded-xl bg-surface-sunken">
              <Loader2 size={20} className="animate-spin text-violet-600" />
            </div>
          ) : message ? (
            <div role="alert" className="rounded-xl bg-red-50 px-3.5 py-3 text-[12.5px] text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {message}
              {needsDelivery && (
                <Link href="/settings/marketplace?tab=store" className="mt-1.5 block font-semibold underline">
                  Go to Store settings
                </Link>
              )}
            </div>
          ) : link ? (
            <div className="space-y-3">
              <ShareLink link={link} />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
                <Link href={`/pay/${link.code}`} target="_blank" className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:underline dark:text-violet-300">
                  <ExternalLink size={13} /> See what buyers see
                </Link>
                <Link href="/settings/marketplace?tab=links" className="font-semibold text-ink-2 hover:underline">
                  Manage your links
                </Link>
              </div>
              <p className="text-[11.5px] leading-relaxed text-subtle">
                Price, photos and stock follow your product, so the link stays up to date. Buyers choose from your delivery zones and pickup points.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
