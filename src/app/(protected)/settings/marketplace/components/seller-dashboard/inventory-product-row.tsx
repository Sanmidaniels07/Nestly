"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { LowStockProduct } from "@/src/services/seller-dashboard.services";

interface Props {
  product: LowStockProduct;
}

export default function InventoryProductRow({ product }: Props) {
  const statusConfig =
    product.stock > 5
      ? { label: "In stock", tone: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" }
      : product.stock > 0
        ? { label: "Low stock", tone: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300" }
        : { label: "Out of stock", tone: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300" };

  const primaryImage =
    product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url;

  return (
    <tr className="border-t border-line-soft">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3.5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
            {primaryImage && (
              <Image src={primaryImage} alt={product.title} fill className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13.5px] font-semibold text-ink">
              {product.title}
            </h3>
            {product.brand && <p className="mt-0.5 text-[12px] text-subtle">{product.brand}</p>}
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-ink">
        ₦{product.price.toLocaleString()}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] text-ink-2">
        {product.stock}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${statusConfig.tone}`}>
          {statusConfig.label}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <Link
          href={`/marketplace/product/${product.id}`}
          aria-label="View product"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-muted transition-colors hover:bg-surface-muted hover:text-violet-600 dark:hover:text-violet-400"
        >
          <Eye size={15} />
        </Link>
      </td>
    </tr>
  );
}
