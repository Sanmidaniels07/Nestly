"use client";

import { Package, ShoppingBag } from "lucide-react";
import { useCart } from "@/src/hooks/use-cart";
import Skeleton from "@/src/components/ui/skeleton";
import CheckoutOrderItem from "./checkout-order-item";

export default function OrderItems() {
  const { data: items, isLoading } = useCart();

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <Package size={16} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-[#13131A]">
            Order items
          </h2>
          <p className="text-[13px] text-[#64748B]">
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E0EE] py-10 text-center">
          <ShoppingBag size={28} className="text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-3 text-[13.5px] font-medium text-[#13131A]">Your cart is empty</p>
          <p className="mt-1 text-[12.5px] text-[#94A3B8]">Add items to your cart before checking out.</p>
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
