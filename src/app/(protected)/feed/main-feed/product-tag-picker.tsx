"use client";

import { useRef, useState } from "react";
import { Check, ShoppingBag, X } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { useClickOutside } from "@/src/hooks/use-click-outside";
import { Product } from "@/src/types/product";

export function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

const primaryImage = (product: Product) =>
  product.images?.find((image) => image.isPrimary)?.url ?? product.images?.[0]?.url;

interface Props {
  productId: string | null;
  onChange: (productId: string | null) => void;
}

// "Tag a product" for sellers: links one of their published products to the
// post so readers can buy it straight from the feed. Renders nothing for
// people without a store or published products.
export default function ProductTagPicker({ productId, onChange }: Props) {
  const { data: seller } = useMySeller();
  const hasStore = seller?.status === "APPROVED" && !!seller.store;
  const { data } = useMyProducts({ status: "PUBLISHED", limit: 50 }, { enabled: hasStore });
  const products = data?.products ?? [];

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  if (!hasStore || products.length === 0) return null;

  const selected = products.find((product) => product.id === productId);

  return (
    <div ref={ref} className="relative">
      {selected ? (
        <span className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-tint py-1 pl-2.5 pr-1 text-[12.5px] font-medium text-violet-700 dark:text-violet-300">
          <ShoppingBag size={13} className="shrink-0" />
          <span className="truncate">{selected.title}</span>
          <button
            onClick={() => onChange(null)}
            aria-label="Remove product tag"
            className="rounded-full p-1 hover:bg-violet-100 dark:hover:bg-violet-500/20"
          >
            <X size={12} />
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full p-2 text-subtle transition-colors hover:bg-tint hover:text-violet-600 dark:hover:text-violet-400"
          aria-label="Tag a product"
          title="Tag a product from your store"
        >
          <ShoppingBag size={18} />
        </button>
      )}

      {open && !selected && (
        <div className="absolute left-0 top-11 z-20 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
          <p className="border-b border-line-soft px-4 py-2.5 text-[12px] font-semibold text-muted">
            Tag a product from your store
          </p>
          <ul className="max-h-64 overflow-y-auto py-1">
            {products.map((product) => {
              const image = primaryImage(product);
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(product.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-surface-2"
                  >
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-ink">{product.title}</span>
                      <span className="block font-[family-name:var(--font-mono)] text-[12px] text-violet-700 dark:text-violet-300">
                        {money(product.price)}
                      </span>
                    </span>
                    {product.id === productId && <Check size={14} className="text-violet-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
