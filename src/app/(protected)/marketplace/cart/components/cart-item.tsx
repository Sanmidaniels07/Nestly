"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Star, Trash2 } from "lucide-react";

import { CartItem as CartItemType } from "@/src/types/cart";
import { useUpdateCartItem } from "@/src/hooks/use-update-cart-item";
import { useRemoveCartItem } from "@/src/hooks/use-remove-cart-item";
import { useToggleWishlist } from "@/src/hooks/use-toggle-wishlist";
import { formatConditionLabel } from "@/src/lib/utils";

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

export default function CartItem({ item }: Props) {
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { toggle: saveForLater } = useToggleWishlist(item.productId);

  const product = item.product;
  const unitPrice = item.unitPrice ?? product.price;
  const stock = item.variation ? item.variation.stock : product.stock;
  const atMin = item.quantity <= 1;
  const atMax = item.quantity >= stock;

  const primaryImage =
    product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url;

  return (
    <article className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex gap-4">
        <Link
          href={`/marketplace/product/${product.id}`}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:h-28 sm:w-28"
        >
          {primaryImage && (
            <Image fill src={primaryImage} alt={product.title} className="object-cover" />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/marketplace/product/${product.id}`}>
                <h3 className="truncate font-[family-name:var(--font-fraunces)] text-[18px] italic text-ink hover:text-violet-700 dark:hover:text-violet-300 sm:text-[20px]">
                  {product.title}
                </h3>
              </Link>

              {item.variantLabel && (
                <p className="mt-1 text-[12.5px] font-medium text-ink-2">{item.variantLabel}</p>
              )}

              {product.store && (
                <p className="mt-1.5 truncate text-[12.5px] text-muted">
                  {product.store.name}
                </p>
              )}

              {product.store?.canDeliver === false && (
                <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] leading-snug text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
                  This seller hasn&apos;t set up delivery or pickup yet - remove it to check out.
                </p>
              )}

              {product.rating !== undefined && (
                <div className="mt-1.5 flex items-center gap-1">
                  <Star size={13} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
                    {product.rating}
                  </span>
                  {product.reviewCount !== undefined && (
                    <span className="font-[family-name:var(--font-mono)] text-[12px] text-subtle">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}

              <span className="mt-2.5 inline-flex rounded-full bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:text-violet-300">
                {formatConditionLabel(product.condition)}
              </span>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700 dark:text-violet-300 sm:text-[19px]">
                {formatPrice(unitPrice)}
              </p>
              {product.originalPrice && unitPrice === product.price && (
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[12px] text-subtle line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex items-center rounded-xl border border-line">
              <button
                onClick={() =>
                  updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })
                }
                disabled={atMin}
                aria-label="Decrease quantity"
                className="p-2.5 text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-muted"
              >
                <Minus size={15} />
              </button>

              <span className="min-w-[36px] text-center font-[family-name:var(--font-mono)] text-[13.5px] font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })
                }
                disabled={atMax}
                aria-label="Increase quantity"
                className="p-2.5 text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-muted"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  saveForLater();
                  removeItem(item.id);
                }}
                className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400"
              >
                <Heart size={15} />
                Save for later
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-1.5 text-[13px] text-red-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
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
