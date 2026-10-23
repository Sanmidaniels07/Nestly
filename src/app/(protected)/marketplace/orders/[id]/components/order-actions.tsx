"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import { Order } from "@/src/types/order";
import { useAddToCart } from "@/src/hooks/use-add-to-cart";
import { useCancelOrder } from "@/src/hooks/use-cancel-order";

interface Props {
  order: Order;
}

export default function OrderActions({ order }: Props) {
  const canCancel = !["delivered", "cancelled"].includes(order.status.toLowerCase());

  const { mutate: addToCart } = useAddToCart();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const [added, setAdded] = useState(false);

  const handleBuyAgain = () => {
    order.items.forEach((item) => {
      addToCart({ productId: item.productId, quantity: item.quantity, variationId: item.variationId ?? undefined });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Actions
      </h2>

      <div className="mt-5 space-y-2.5">
        <button
          onClick={handleBuyAgain}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-all ${
            added
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110"
          }`}
        >
          {added ? <Check size={16} /> : <RotateCcw size={16} />}
          {added ? "Added to cart" : "Buy again"}
        </button>

        {canCancel && (
          <button
            onClick={() => cancelOrder(order.id)}
            disabled={isCancelling}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-red-200 dark:border-red-500/30 text-[13px] font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </div>
    </section>
  );
}
