"use client";

import CartEmpty from "./components/cart-empty";
import CartHeader from "./components/cart-header";
import CartItem from "./components/cart-item";
import CartRecentlyViewed from "./components/cart-recently-viewed";
import CartSummary from "./components/cart-summary";

import { useCartStore } from "@/src/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10">

        <CartEmpty />

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">

      <CartHeader
        itemsCount={items.length}
        onClearCart={clearCart}
      />

      <div className="grid gap-8 xl:grid-cols-[1.8fr_420px]">

        <section className="space-y-6">

          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
            />
          ))}

          <CartRecentlyViewed />

        </section>

        <CartSummary />

      </div>

    </div>
  );
}