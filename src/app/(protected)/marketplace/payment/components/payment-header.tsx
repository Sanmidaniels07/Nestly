"use client";

import Link from "next/link";
import { CreditCard, ChevronRight } from "lucide-react";

export default function PaymentHeader() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-[#94A3B8]">
        <Link href="/marketplace" className="hover:text-violet-600">
          Marketplace
        </Link>
        <ChevronRight size={13} />
        <Link href="/marketplace/cart" className="hover:text-violet-600">
          Cart
        </Link>
        <ChevronRight size={13} />
        <Link href="/marketplace/checkout" className="hover:text-violet-600">
          Checkout
        </Link>
        <ChevronRight size={13} />
        <span className="font-medium text-[#13131A]">Payment</span>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
          <CreditCard size={20} className="text-white" />
        </div>

        <div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[30px] italic text-[#13131A] sm:text-[34px]">
            Payment
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[#64748B]">
            Securely complete your purchase.
          </p>
        </div>
      </div>
    </section>
  );
}