"use client";

import { Lock, ShieldCheck } from "lucide-react";

export default function PaymentSecurity() {
  return (
    <div className="rounded-xl bg-surface-sunken p-4">
      <div className="flex gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>

        <div>
          <h3 className="text-[13.5px] font-semibold text-ink">Secure payment</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
            Your payment is encrypted using industry-standard 256-bit SSL security.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
            <Lock size={13} />
            PCI DSS compliant
          </div>
        </div>
      </div>
    </div>
  );
}