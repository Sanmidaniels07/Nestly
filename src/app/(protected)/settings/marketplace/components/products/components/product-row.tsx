"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { sellerProducts } from "@/src/mocks/seller-products";

interface Props {
  product: (typeof sellerProducts)[number];
  onDelete?: (id: string) => void;
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function ProductRow({ product, onDelete }: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const status =
    product.stock === 0 ? "Out of stock" : product.active ? "Active" : "Draft";

  const statusTone =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Draft"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-700";

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }
    onDelete?.(product.id);
  };

  return (
    <tr className="group border-b border-[#F0F0F4] transition-colors last:border-0 hover:bg-[#FAFAFB]">
      {/* Product */}
      <td className="px-4 py-3 pl-5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F4F4F7]">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-[#13131A]">{product.name}</p>
            <p className="mt-0.5 truncate text-[12px] text-[#94A3B8]">{product.brand}</p>
          </div>
        </div>
      </td>

      {/* SKU */}
      <td className="whitespace-nowrap px-4 py-3 font-[family-name:var(--font-mono)] text-[12.5px] text-[#64748B]">
        {product.sku}
      </td>

      {/* Price */}
      <td className="whitespace-nowrap px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[13px] font-medium text-[#13131A]">
        ₦{product.price.toLocaleString()}
      </td>

      {/* Stock */}
      <td className="whitespace-nowrap px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[13px] text-[#334155]">
        {product.stock}
      </td>

      {/* Sold */}
      <td className="whitespace-nowrap px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[13px] text-[#334155]">
        {formatNumber(product.totalSold)}
      </td>

      {/* Views */}
      <td className="whitespace-nowrap px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[13px] text-[#94A3B8]">
        {formatNumber(product.views)}
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-4 py-3">
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${statusTone}`}>
          {status}
        </span>
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-4 py-3 pr-5">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/settings/marketplace/products/${product.id}`}
            aria-label="View product"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] transition-colors hover:bg-[#F0F0F4] hover:text-[#334155]"
          >
            <Eye size={14} />
          </Link>

          <Link
            href={`/settings/marketplace/products/${product.id}/edit`}
            aria-label="Edit product"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] transition-colors hover:bg-[#F0F0F4] hover:text-[#334155]"
          >
            <Pencil size={14} />
          </Link>

          <button
            onClick={handleDelete}
            aria-label={confirmingDelete ? "Confirm delete" : "Delete product"}
            className={`
              flex h-7 items-center justify-center gap-1 rounded-md px-1.5 text-[11.5px] font-medium transition-colors
              ${
                confirmingDelete
                  ? "w-16 bg-red-600 text-white hover:bg-red-700"
                  : "w-7 text-[#94A3B8] hover:bg-red-50 hover:text-red-600"
              }
            `}
          >
            <Trash2 size={14} />
            {confirmingDelete && "Sure?"}
          </button>
        </div>
      </td>
    </tr>
  );
}