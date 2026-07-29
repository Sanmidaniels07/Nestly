"use client";

import CartEmpty from "./components/cart-empty";
import CartHeader from "./components/cart-header";
import CartItem from "./components/cart-item";
import CartRecentlyViewed from "./components/cart-recently-viewed";
import CartSummary from "./components/cart-summary";

import { useCart } from "@/src/hooks/use-cart";
import { useClearCart } from "@/src/hooks/use-clear-cart";
import Skeleton from "@/src/components/ui/skeleton";

export default function CartPage() {
  const { data: items, isLoading } = useCart();
  const { mutate: clearCart } = useClearCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        <Skeleton className="h-8 w-48" />

        <div className="grid gap-8 xl:grid-cols-[1.8fr_420px]">
          <section className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-[#ECE9F6] bg-white p-4">
                <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </section>

          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10">
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
      <CartHeader itemsCount={items.length} onClearCart={() => clearCart(items)} />

      <div className="grid gap-8 xl:grid-cols-[1.8fr_420px]">
        <section className="space-y-6">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <CartRecentlyViewed />
        </section>

        <CartSummary items={items} />
      </div>
    </div>
  );
}
