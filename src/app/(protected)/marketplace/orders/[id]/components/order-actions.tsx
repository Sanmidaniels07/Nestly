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
      addToCart({ productId: item.productId, quantity: item.quantity });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Actions
      </h2>

      <div className="mt-5 space-y-2.5">
        <button
          onClick={handleBuyAgain}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-all ${
            added
              ? "bg-emerald-50 text-emerald-700"
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
            className="flex h-12 w-full items-center justify-center rounded-xl border border-red-200 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </div>
    </section>
  );
}
