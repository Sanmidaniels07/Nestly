"use client";

import Image from "next/image";
import { CartItem } from "@/src/types/cart";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

interface Props {
  item: CartItem;
}

export default function CheckoutOrderItem({ item }: Props) {
  return (
    <article className="flex gap-3.5 rounded-xl border border-[#ECE9F6] p-3.5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F8F8FC]">
        <Image fill src={item.product.images[0]} alt={item.product.name} className="object-cover" />

        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-white ring-2 ring-white">
          {item.quantity}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-[14.5px] font-semibold text-[#13131A]">
          {item.product.name}
        </h3>
        <p className="mt-0.5 text-[12.5px] text-[#94A3B8]">{item.product.brand}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#64748B]">
            Qty {item.quantity}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[14.5px] font-semibold text-violet-700">
            {money(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </article>
  );
}