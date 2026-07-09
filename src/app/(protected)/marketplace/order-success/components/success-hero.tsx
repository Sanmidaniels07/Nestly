"use client";

import { CheckCircle2 } from "lucide-react";

interface Props {
  orderNumber: string;
}

export default function SuccessHero({ orderNumber }: Props) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-white sm:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
          <CheckCircle2 size={32} />
        </div>

        <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-[34px] italic sm:text-[42px]">
          Payment successful
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-violet-100">
          Thank you for shopping with Nestly. Your order has been received and is now being prepared.
        </p>

        <p className="mt-4 font-[family-name:var(--font-mono)] text-[13px] text-violet-200">
          Order {orderNumber}
        </p>
      </div>
    </section>
  );
}