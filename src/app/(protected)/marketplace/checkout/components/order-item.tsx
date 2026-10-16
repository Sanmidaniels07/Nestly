"use client";

import { Package, ShoppingBag } from "lucide-react";
import { useCart } from "@/src/hooks/use-cart";
import Skeleton from "@/src/components/ui/skeleton";
import CheckoutOrderItem from "./checkout-order-item";

export default function OrderItems() {
  const { data: items, isLoading } = useCart();

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <Package size={16} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-ink">
            Order items
          </h2>
          <p className="text-[13px] text-muted">
            Review the products you&apos;re purchasing.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!items || items.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong py-10 text-center">
          <ShoppingBag size={28} className="text-faint" strokeWidth={1.5} />
          <p className="mt-3 text-[13.5px] font-medium text-ink">Your cart is empty</p>
          <p className="mt-1 text-[12.5px] text-subtle">Add items to your cart before checking out.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items?.map((item) => (
            <CheckoutOrderItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
