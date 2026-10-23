"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { CartItem } from "@/src/types/cart";

interface Props {
  items: CartItem[];
}

function money(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartSummary({ items }: Props) {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-ink">
        Order summary
      </h2>

      <div className="mt-6 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[13.5px] text-muted">Subtotal ({totalItems} items)</span>
          <span className="font-[family-name:var(--font-mono)] text-[13.5px] text-ink-2">
            {money(subtotal)}
          </span>
        </div>

        <p className="text-[12px] text-subtle">
          Delivery and total are calculated at checkout.
        </p>
      </div>

      <Link
        href="/marketplace/checkout"
        className="mt-6 flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white transition-all hover:brightness-110"
      >
        Proceed to checkout
      </Link>

      <div className="mt-6 space-y-3 text-[12.5px] text-muted">
        <div className="flex items-start gap-2.5">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          Secure payment protected with SSL encryption.
        </div>
      </div>
    </aside>
  );
}
