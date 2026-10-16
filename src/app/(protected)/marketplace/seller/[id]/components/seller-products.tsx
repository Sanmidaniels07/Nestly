"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/src/types/product";

interface Props {
  products: Product[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SellerProducts({ products }: Props) {
  return (
    <section className="space-y-6">
      <div className="border-b border-dashed border-line pb-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Store products
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
          Products
        </h2>
        <p className="mt-1.5 text-[13px] text-muted">
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => {
            const primaryImage =
              product.images.find((image) => image.isPrimary)?.url ??
              product.images[0]?.url;

            return (
              <Link
                key={product.id}
                href={`/marketplace/product/${product.id}`}
                className="overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-1 hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-xl"
              >
                <div className="relative aspect-square bg-surface-sunken">
                  {primaryImage && (
                    <Image
                      src={primaryImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="space-y-1.5 p-4">
                  <h3 className="line-clamp-1 text-[14px] font-medium text-ink">
                    {product.title}
                  </h3>
                  <p className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-violet-700 dark:text-violet-300">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken py-16 text-center">
          <p className="text-[13.5px] text-subtle">This store has no products yet.</p>
        </div>
      )}
    </section>
  );
}
