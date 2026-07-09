"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function InventoryProductRow({ product }: Props) {
  const statusConfig =
    product.stock > 5
      ? { label: "In stock", tone: "bg-emerald-50 text-emerald-700" }
      : product.stock > 0
      ? { label: "Low stock", tone: "bg-amber-50 text-amber-700" }
      : { label: "Out of stock", tone: "bg-red-50 text-red-700" };

  return (
    <tr className="border-t border-[#F2F1F8]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3.5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F8F8FC]">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13.5px] font-semibold text-[#13131A]">
              {product.name}
            </h3>
            <p className="mt-0.5 text-[12px] text-[#94A3B8]">{product.brand}</p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[#13131A]">
        ₦{product.price.toLocaleString()}
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] text-[#334155]">
        {product.stock}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${statusConfig.tone}`}>
          {statusConfig.label}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex gap-2">
          <Link
            href={`/marketplace/products/${product.slug}`}
            aria-label="View product"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F7FB] text-[#64748B] transition-colors hover:bg-[#EFEDF9] hover:text-violet-600"
          >
            <Eye size={15} />
          </Link>
          <Link
            href={`/settings/marketplace/products/${product.id}/edit`}
            aria-label="Edit product"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition-colors hover:bg-violet-100"
          >
            <Pencil size={15} />
          </Link>
        </div>
      </td>
    </tr>
  );
}