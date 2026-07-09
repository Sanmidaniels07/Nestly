"use client";

import { Lock, ShieldCheck } from "lucide-react";

export default function PaymentSecurity() {
  return (
    <div className="rounded-xl bg-[#F8F8FC] p-4">
      <div className="flex gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <ShieldCheck size={16} className="text-emerald-600" />
        </div>

        <div>
          <h3 className="text-[13.5px] font-semibold text-[#13131A]">Secure payment</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[#64748B]">
            Your payment is encrypted using industry-standard 256-bit SSL security.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
            <Lock size={13} />
            PCI DSS compliant
          </div>
        </div>
      </div>
    </div>
  );
}