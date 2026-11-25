"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Archive, Eye, Link2, Pencil } from "lucide-react";

import { Product } from "@/src/types/product";
import { useDeleteProduct } from "@/src/hooks/use-delete-product";
import Checkbox from "@/src/components/ui/checkbox";
import SharePayLinkDialog from "@/src/components/marketplace/share-pay-link-dialog";
import ActionTip from "@/src/components/ui/action-tip";
import ProductQuickView from "./product-quick-view";

interface Props {
  product: Product;
  selected: boolean;
  onToggleSelect: () => void;
}

export default function ProductRow({ product, selected, onToggleSelect }: Props) {
  const [confirmingArchive, setConfirmingArchive] = useState(false);
  const [sharingPayLink, setSharingPayLink] = useState(false);
  const [viewing, setViewing] = useState(false);
  const { mutate: archiveProduct } = useDeleteProduct();

  const status =
    product.status === "ARCHIVED"
      ? "Archived"
      : product.status === "PUBLISHED"
        ? "Published"
        : product.status === "OUT_OF_STOCK"
          ? "Sold out"
          : "Draft";

  const statusTone =
    status === "Published"
      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status === "Draft"
        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : status === "Sold out"
          ? "bg-surface-2 text-muted"
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
        <Checkbox size="sm" checked={selected} onChange={() => onToggleSelect()} ariaLabel={`Select ${product.title}`} />
      </td>

      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => setViewing(true)}
          className="group/open -m-1.5 flex max-w-[260px] items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/10"
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            {primaryImage && (
              <Image src={primaryImage} alt={product.title} fill sizes="44px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-ink group-hover/open:text-violet-700 dark:group-hover/open:text-violet-300">{product.title}</p>
            <p className="mt-0.5 truncate text-[12px] text-subtle">{product.brand || "Tap to see details and actions"}</p>
          </div>
        </button>
        {viewing && (
          <ProductQuickView
            product={product}
            status={status}
            statusTone={statusTone}
            onClose={() => setViewing(false)}
            onPayLink={() => {
              setViewing(false);
              setSharingPayLink(true);
            }}
            onArchive={() => {
              setViewing(false);
              archiveProduct(product.id);
            }}
          />
        )}
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
          {product.status === "PUBLISHED" && (
            <ActionTip label="Share a pay link - buyers pay without an account">
            <button
              type="button"
              onClick={() => setSharingPayLink(true)}
              aria-label="Share pay link"
              className="flex h-7 items-center justify-center gap-1 rounded-md px-1.5 text-[11.5px] font-semibold text-violet-700 transition-colors hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            >
              <Link2 size={14} /> Pay link
            </button>
            </ActionTip>
          )}
          {sharingPayLink && (
            <SharePayLinkDialog productId={product.id} productTitle={product.title} onClose={() => setSharingPayLink(false)} />
          )}

          <ActionTip label="View in your shop, as buyers see it">
          <Link
            href={`/marketplace/product/${product.id}`}
            aria-label="View in your shop"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-muted hover:text-ink-2"
          >
            <Eye size={14} />
          </Link>
          </ActionTip>

          <ActionTip label="Edit photos, details, price and stock">
          <Link
            href={`/settings/marketplace/components/products/${product.id}/edit`}
            aria-label="Edit product"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-muted hover:text-ink-2"
          >
            <Pencil size={14} />
          </Link>
          </ActionTip>

          {product.status !== "ARCHIVED" && (
            <ActionTip label={confirmingArchive ? "Tap again to archive" : "Archive - takes it out of your shop (past orders are kept)"}>
            <button
              onClick={handleArchive}
              aria-label={confirmingArchive ? "Confirm archive" : "Archive product"}
              className={`whitespace-nowrap 
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
            </ActionTip>
          )}
        </div>
      </td>
    </tr>
  );
}
