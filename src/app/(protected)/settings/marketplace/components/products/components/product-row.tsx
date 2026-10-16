"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Archive, Eye, Pencil } from "lucide-react";

import { Product } from "@/src/types/product";
import { useDeleteProduct } from "@/src/hooks/use-delete-product";

interface Props {
  product: Product;
  selected: boolean;
  onToggleSelect: () => void;
}

export default function ProductRow({ product, selected, onToggleSelect }: Props) {
  const [confirmingArchive, setConfirmingArchive] = useState(false);
  const { mutate: archiveProduct } = useDeleteProduct();

  const status =
    product.status === "ARCHIVED"
      ? "Archived"
      : product.status === "PUBLISHED"
        ? "Published"
        : "Draft";

  const statusTone =
    status === "Published"
      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status === "Draft"
        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300";

  const primaryImage =
    product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url;

  const handleArchive = () => {
    if (!confirmingArchive) {
      setConfirmingArchive(true);
      setTimeout(() => setConfirmingArchive(false), 3000);
      return;
    }
    archiveProduct(product.id);
  };

  return (
    <tr className="group border-b border-line-soft transition-colors last:border-0 hover:bg-surface-sunken">
      <td className="w-10 px-4 py-3 pl-5">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          aria-label={`Select ${product.title}`}
          className="h-4 w-4 rounded border-line-strong text-violet-600 dark:text-violet-400 focus:ring-violet-400"
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            {primaryImage && (
              <Image src={primaryImage} alt={product.title} fill className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-ink">{product.title}</p>
            {product.brand && (
              <p className="mt-0.5 truncate text-[12px] text-subtle">{product.brand}</p>
            )}
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-3 font-[family-name:var(--font-mono)] text-[12.5px] text-muted">
        {product.sku}
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[13px] font-medium text-ink">
        ₦{product.price.toLocaleString()}
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[13px] text-ink-2">
        {product.stock}
      </td>

      <td className="whitespace-nowrap px-4 py-3">
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${statusTone}`}>
          {status}
        </span>
      </td>

      <td className="whitespace-nowrap px-4 py-3 pr-5">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/marketplace/product/${product.id}`}
            aria-label="View product"
            className="flex h-7 w-7 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-muted hover:text-ink-2"
          >
            <Eye size={14} />
          </Link>

          <Link
            href={`/settings/marketplace/components/products/${product.id}/edit`}
            aria-label="Edit product"
            className="flex h-7 w-7 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-muted hover:text-ink-2"
          >
            <Pencil size={14} />
          </Link>

          {product.status !== "ARCHIVED" && (
            <button
              onClick={handleArchive}
              aria-label={confirmingArchive ? "Confirm archive" : "Archive product"}
              className={`
                flex h-7 items-center justify-center gap-1 rounded-md px-1.5 text-[11.5px] font-medium transition-colors
                ${
                  confirmingArchive
                    ? "w-16 bg-red-600 text-white hover:bg-red-700"
                    : "w-7 text-subtle hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                }
              `}
            >
              <Archive size={14} />
              {confirmingArchive && "Sure?"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
