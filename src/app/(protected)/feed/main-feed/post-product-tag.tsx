"use client";

import Link from "next/link";
import { ShoppingBag, Store } from "lucide-react";

import { PostProduct } from "@/src/types/post";
import { money } from "./product-tag-picker";

// "Shop this post": the product a seller tagged, linking to its page.
export default function PostProductTag({ product }: { product: PostProduct }) {
  return (
    <Link
      href={`/marketplace/product/${product.id}`}
      className="group mt-3 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-2.5 pr-4 transition-colors hover:border-violet-300 dark:border-violet-500/20 dark:bg-violet-500/[0.07] dark:hover:border-violet-500/40"
    >
      <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-violet-500">
            <ShoppingBag size={20} />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink">{product.title}</span>
        <span className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-muted">
          <Store size={12} className="shrink-0" />
          {product.store.name}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-[family-name:var(--font-mono)] text-[14px] font-semibold text-violet-700 dark:text-violet-300">
          {money(product.price)}
        </span>
        <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 py-1 text-[11.5px] font-semibold text-white transition group-hover:brightness-110">
          <ShoppingBag size={11} /> Shop
        </span>
      </span>
    </Link>
  );
}
