"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// Why buying on Nestly is safe - said once, right after paying.
export default function ProtectionStrip() {
  return (
    <section className="flex items-start gap-3.5 rounded-[20px] border border-emerald-200 bg-emerald-50/70 px-5 py-4 dark:border-emerald-500/25 dark:bg-emerald-500/10">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
        <ShieldCheck size={19} />
      </span>
      <div className="min-w-0 text-[13.5px] leading-relaxed">
        <p className="font-semibold text-ink">Protected by Nestly</p>
        <p className="text-muted">
          Your delivery code is your protection: only share it once you have your items. If anything goes wrong, report it from your order page and
          we&apos;ll help sort it out.{" "}
          <Link href="/guides/buyers" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
            How it works
          </Link>
        </p>
      </div>
    </section>
  );
}
