"use client";

import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
        <Link href="/marketplace" className="transition-colors hover:text-violet-600">
          Marketplace
        </Link>
        <ChevronRight size={13} />
        <Link href="/marketplace/cart" className="transition-colors hover:text-violet-600">
          Cart
        </Link>
        <ChevronRight size={13} />
        <span className="font-medium text-[#13131A]">Checkout</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600">
          <ShoppingCart size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] italic text-[#13131A]">
            Checkout
          </h1>
          <p className="mt-1 text-[13.5px] text-[#64748B]">
            Review your order and continue to payment.
          </p>
        </div>
      </div>
    </section>
  );
}