"use client";

import { CreditCard, Landmark, Shield } from "lucide-react";

const methods = [
  { label: "Paystack" },
  { label: "Flutterwave" },
  { label: "Cards", icon: CreditCard },
  { label: "Transfer", icon: Landmark },
];

export default function PaymentMethods() {
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-[#13131A]">Secure payments</p>

      <div className="grid grid-cols-2 gap-2">
        {methods.map((method) => (
          <div
            key={method.label}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#ECE9F6] py-2.5 text-[12.5px] font-medium text-[#334155]"
          >
            {method.icon && <method.icon size={14} />}
            {method.label}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[#94A3B8]">
        <Shield size={12} />
        All payments are encrypted.
      </div>
    </div>
  );
}