"use client";

import { Headphones, MessageCircle, ShieldCheck } from "lucide-react";

export default function SupportCard() {
  return (
    <section className="rounded-2xl border border-line bg-gradient-to-br from-violet-50 dark:from-violet-500/10 to-surface p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600">
          <Headphones size={19} className="text-white" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-ink">Need help?</h3>
          <p className="text-[13px] text-muted">Our support team is here for you.</p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40">
          <MessageCircle size={16} className="text-violet-600 dark:text-violet-400" />
          Chat seller
        </button>

        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40">
          <ShieldCheck size={16} className="text-violet-600 dark:text-violet-400" />
          Report an issue
        </button>
      </div>
    </section>
  );
}