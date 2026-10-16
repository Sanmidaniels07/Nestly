"use client";

import { Order } from "@/src/types/order";
import { CreditCard, Receipt } from "lucide-react";

interface Props {
  order: Order;
}

export default function PaymentDetails({ order }: Props) {
  if (!order.paymentMethod && !order.paymentReference) return null;

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Payment
      </h2>

      <div className="mt-5 space-y-4">
        {order.paymentMethod && (
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
              <CreditCard size={16} className="text-violet-700 dark:text-violet-300" />
            </div>
            <div>
              <p className="text-[12.5px] text-muted">Method</p>
              <p className="mt-0.5 text-[13.5px] font-semibold text-ink">
                {order.paymentMethod}
              </p>
            </div>
          </div>
        )}

        {order.paymentReference && (
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
              <Receipt size={16} className="text-violet-700 dark:text-violet-300" />
            </div>
            <div>
              <p className="text-[12.5px] text-muted">Reference</p>
              <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-ink">
                {order.paymentReference}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
