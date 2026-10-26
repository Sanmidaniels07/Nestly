import Link from "next/link";
import { ShieldAlert } from "lucide-react";

// Standing reminder on the seller dashboard: every sale goes through Nestly
// checkout, and what happens if it doesn't (seller-terms#conduct).
export default function KeepSalesOnNestly() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 dark:border-amber-500/25 dark:bg-amber-500/5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
          <ShieldAlert size={19} />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-ink">Keep every sale on Nestly</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
            Buyers you meet on Nestly must pay through Nestly checkout. Don&apos;t ask them to pay by transfer, cash or POS, or to finish the deal on
            WhatsApp, Instagram, phone or email - those sales aren&apos;t protected for you or the buyer.
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
            <span className="font-semibold">Breaking this rule can lead to</span> a warning, removed products, losing your verified badge and referral
            rewards, store suspension, or a permanent ban.{" "}
            <Link href="/seller-terms#conduct" className="font-semibold text-amber-700 underline-offset-2 hover:underline dark:text-amber-300">
              Read the rules
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
