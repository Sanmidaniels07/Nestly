"use client";

import { RotateCcw, Truck, ShieldCheck, CreditCard, Clock3, CheckCircle2 } from "lucide-react";
import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerPolicies({ seller }: Props) {
  const policies = [
    { icon: RotateCcw, title: "Returns", value: seller.policies.returns },
    { icon: Truck, title: "Shipping", value: seller.policies.shipping },
    { icon: ShieldCheck, title: "Warranty", value: seller.policies.warranty },
    { icon: CreditCard, title: "Payment", value: "Card, bank transfer & wallet" },
    { icon: Clock3, title: "Response", value: seller.responseTime },
    {
      icon: CheckCircle2,
      title: "Verification",
      value: seller.verified ? "Verified marketplace seller" : "Standard marketplace seller",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
          Store policies
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          Shop with confidence
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {policies.map((policy) => {
          const Icon = policy.icon;

          return (
            <div
              key={policy.title}
              className="rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-colors hover:border-violet-200 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50">
                <Icon size={18} className="text-violet-600" />
              </div>

              <h3 className="mt-4 text-[14.5px] font-semibold text-[#13131A]">
                {policy.title}
              </h3>

              <p className="mt-1.5 text-[13px] leading-relaxed text-[#64748B]">
                {policy.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}