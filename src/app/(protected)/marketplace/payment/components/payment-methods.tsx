"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";
import PaymentMethodCard from "./payment-method-card";
import { useCheckoutStore } from "@/src/store/checkout-store";

export default function PaymentMethods() {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
        Payment method
      </h2>

      <div className="mt-5 space-y-2.5">
        <PaymentMethodCard
          title="Debit / credit card"
          subtitle="Visa, Mastercard, Verve"
          selected={paymentMethod === "card"}
          icon={<CreditCard size={17} className="text-violet-700" />}
          onClick={() => setPaymentMethod("card")}
        />
        <PaymentMethodCard
          title="Bank transfer"
          subtitle="Instant transfer"
          selected={paymentMethod === "bank"}
          icon={<Landmark size={17} className="text-violet-700" />}
          onClick={() => setPaymentMethod("bank")}
        />
        <PaymentMethodCard
          title="Nestly wallet"
          subtitle="Coming soon"
          selected={paymentMethod === "wallet"}
          icon={<Wallet size={17} className="text-violet-700" />}
          onClick={() => setPaymentMethod("wallet")}
          disabled
        />
      </div>
    </section>
  );
}