"use client";

import CartEmpty from "./components/cart-empty";
import CartHeader from "./components/cart-header";
import CartItem from "./components/cart-item";
import CartRecentlyViewed from "./components/cart-recently-viewed";
import CartSummary from "./components/cart-summary";

import { useCart } from "@/src/hooks/use-cart";
import { useClearCart } from "@/src/hooks/use-clear-cart";

export default function CartPage() {
  const { data: items, isLoading } = useCart();
  const { mutate: clearCart } = useClearCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10 text-center text-[14px] text-[#94A3B8]">
        Loading cart...
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
