"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import { useMyReferrals } from "@/src/hooks/use-my-referrals";
import { naira, paymentLinkUrl } from "@/src/lib/payment-link";
import { shareLinks } from "@/src/lib/social";
import { WhatsAppIcon } from "@/src/components/ui/social-icons";
import { PaymentLink } from "@/src/types/payment-link";

// What the seller sends the buyer: the message explains it's protected.
export const shareMessage = (link: Pick<PaymentLink, "title" | "price">) =>
  `Pay ${naira(link.price)} for "${link.title}" securely on Nestly - your money is held until you receive it:`;

export function useLinkUrl(code: string) {
  const { data: referrals } = useMyReferrals(true);
  return paymentLinkUrl(code, referrals?.code);
}

// Copy / WhatsApp / share-sheet buttons for one link.
export default function ShareLink({ link, compact = false }: { link: PaymentLink; compact?: boolean }) {
  const url = useLinkUrl(link.code);
  const [copied, setCopied] = useState(false);
  const message = shareMessage(link);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy - select the link and copy it");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: link.title, text: message, url });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    copy();
  };

  const button =
    "flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40";

  return (
    <div className="space-y-2">
      {!compact && (
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-sunken p-1.5 pl-3.5">
          <p className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink-2">{url.replace(/^https?:\/\//, "")}</p>
          <button
            type="button"
            onClick={copy}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12.5px] font-semibold text-white"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {compact && (
          <button type="button" onClick={copy} className={button}>
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />} {copied ? "Copied" : "Copy link"}
          </button>
        )}
        <a href={shareLinks(url, message).whatsapp} target="_blank" rel="noopener noreferrer" className={button}>
          <WhatsAppIcon size={15} className="text-emerald-600" /> WhatsApp
        </a>
        <button type="button" onClick={share} className={button}>
          <Share2 size={14} /> Share
        </button>
      </div>
    </div>
  );
}
