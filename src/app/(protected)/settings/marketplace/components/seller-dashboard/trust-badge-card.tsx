"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useMyStore } from "@/src/hooks/use-my-store";
import { useMyReferrals } from "@/src/hooks/use-my-referrals";
import { useStoreTrust } from "@/src/hooks/use-store-trust";
import { SITE_URL } from "@/src/lib/site";
import { shareLinks } from "@/src/lib/social";
import { TRUST_LEVEL, trustSummary } from "@/src/lib/trust";
import { WhatsAppIcon } from "@/src/components/ui/social-icons";

// "Your trust badge": the seller's record as a short link for their
// Instagram / WhatsApp bio. Buyers who tap it see real numbers from Nestly
// orders - and every sale through Nestly makes the record stronger.
export default function TrustBadgeCard() {
  const { data: store } = useMyStore();
  const { data: referrals } = useMyReferrals(!!store);
  const { data: trust } = useStoreTrust(store?.slug);
  const [copied, setCopied] = useState(false);

  if (!store || !trust) return null;

  const url = `${SITE_URL}/s/${store.slug}${referrals ? `?ref=${referrals.code}` : ""}`;
  const shortUrl = `${SITE_URL.replace(/^https?:\/\/(www\.)?/, "")}/s/${store.slug}`;
  const message = `Buy from ${store.name} safely on Nestly - see my track record:`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy - select the link and copy it");
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          <ShieldCheck size={19} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-ink">Your trust badge</h3>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
            Put this link in your Instagram and WhatsApp bio. Buyers see your record from real Nestly orders - it grows with
            every order you deliver.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-surface-sunken p-3.5">
        <p className="text-[13px] font-semibold text-ink">{TRUST_LEVEL[trust.level].label}</p>
        <p className="mt-0.5 text-[12.5px] text-ink-2">{trustSummary(trust)}</p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5 pl-3.5">
        <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono)] text-[12.5px] text-ink-2">{shortUrl}</p>
        <button type="button" onClick={copy} className="whitespace-nowrap flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12.5px] font-semibold text-white">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        <a
          href={shareLinks(url, message).whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-2 hover:border-violet-300 dark:hover:border-violet-500/40"
        >
          <WhatsAppIcon size={15} className="text-emerald-600" /> Share on WhatsApp
        </a>
        <Link
          href={`/s/${store.slug}`}
          target="_blank"
          className="whitespace-nowrap flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-2 hover:border-violet-300 dark:hover:border-violet-500/40"
        >
          <ExternalLink size={14} /> See what buyers see
        </Link>
      </div>
    </section>
  );
}
