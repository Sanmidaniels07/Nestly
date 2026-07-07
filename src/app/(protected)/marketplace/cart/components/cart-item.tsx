"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, Minus, Plus, Star, Trash2 } from "lucide-react";

import { CartItem as CartItemType } from "@/src/types/cart";
import { useCartStore } from "@/src/store/cart-store";

interface Props {
  item: CartItemType;
  compact?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartItem({ item, compact = false }: Props) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const product = item.product;
  const atMin = item.quantity <= 1;
  const atMax = item.quantity >= product.stock;

  return (
    <article className="rounded-2xl border border-[#ECE9F6] bg-white p-4 sm:p-5">
      <div className="flex gap-4">
        <Link
          href={`/marketplace/product/${product.id}`}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F8F8FC] sm:h-28 sm:w-28"
        >
          <Image fill src={product.images[0]} alt={product.name} className="object-cover" />
        </Link>

        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/marketplace/product/${product.id}`}>
                <h3 className="truncate font-[family-name:var(--font-fraunces)] text-[18px] italic text-[#13131A] hover:text-violet-700 sm:text-[20px]">
                  {product.name}
                </h3>
              </Link>

              <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
                {product.seller.verified && <BadgeCheck size={13} className="text-blue-500" />}
                <span className="truncate">{product.seller.name}</span>
              </div>

              <div className="mt-1.5 flex items-center gap-1">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
                  {product.rating}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                  ({product.reviews})
                </span>
              </div>

              <span className="mt-2.5 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700">
                {product.condition}
              </span>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700 sm:text-[19px]">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && (
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8] line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex items-center rounded-xl border border-[#ECE9F6]">
              <button
                onClick={() => decreaseQuantity(product.id)}
                disabled={atMin}
                aria-label="Decrease quantity"
                className="p-2.5 text-[#64748B] transition-colors hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#64748B]"
              >
                <Minus size={15} />
              </button>

              <span className="min-w-[36px] text-center font-[family-name:var(--font-mono)] text-[13.5px] font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(product.id)}
                disabled={atMax}
                aria-label="Increase quantity"
                className="p-2.5 text-[#64748B] transition-colors hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#64748B]"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-[13px] text-[#64748B] transition-colors hover:text-violet-600">
                <Heart size={15} />
                Save
              </button>

              <button
                onClick={() => removeFromCart(product.id)}
                className="flex items-center gap-1.5 text-[13px] text-red-500 transition-colors hover:text-red-600"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}