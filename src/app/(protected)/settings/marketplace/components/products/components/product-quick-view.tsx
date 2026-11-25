"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Archive, ChevronRight, Eye, Link2, Pencil, X } from "lucide-react";

import { Product } from "@/src/types/product";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

interface Props {
  product: Product;
  status: string;
  statusTone: string;
  onClose: () => void;
  onPayLink: () => void;
  onArchive: () => void;
}

// Tapping a product in Seller Hub: its photos and details, and everything
// you can do with it as clear, labelled buttons (the same actions as the
// small icons on the row).
export default function ProductQuickView({ product, status, statusTone, onClose, onPayLink, onArchive }: Props) {
  const images = [...product.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const [active, setActive] = useState(0);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const variations = (product.variations ?? []).filter((v) => v.isActive);
  const optionName = (product.options ?? []).map((o) => o.name).join(" / ");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const actions = [
    {
      key: "view",
      icon: Eye,
      label: "View in your shop",
      hint: "See it exactly as buyers do",
      href: `/marketplace/product/${product.id}`,
      show: product.status !== "ARCHIVED",
    },
    {
      key: "edit",
      icon: Pencil,
      label: "Edit product",
      hint: "Photos, details, price, stock and options",
      href: `/settings/marketplace/components/products/${product.id}/edit`,
      show: true,
    },
    {
      key: "paylink",
      icon: Link2,
      label: "Share pay link",
      hint: "A link buyers can pay with",
      onClick: onPayLink,
      show: product.status === "PUBLISHED",
    },
  ].filter((action) => action.show);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="relative">
          <div className="relative aspect-[4/3] bg-surface-sunken">
            {images[active] && <Image src={images[active].url} alt={product.title} fill sizes="(min-width: 640px) 512px, 100vw" className="object-cover" />}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur hover:bg-surface"
          >
            <X size={18} />
          </button>
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {images.map((image, index) => (
                <button
                  key={image.url}
                  type="button"
                  aria-label={`Photo ${index + 1}`}
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all ${index === active ? "w-5 bg-white" : "w-2 bg-white/60"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[18px] font-semibold leading-snug text-ink">{product.title}</h2>
              <span className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${statusTone}`}>{status}</span>
            </div>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[18px] font-semibold text-violet-700 dark:text-violet-300">
              {naira(product.price)}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-[13px] font-normal text-subtle line-through">{naira(product.originalPrice)}</span>
              )}
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-2">
            {[
              { label: "In stock", value: String(product.stock) },
              { label: "SKU", value: product.sku || "-" },
              { label: "Category", value: product.category?.name ?? "-" },
            ].map((item) => (
              <div key={item.label} className="min-w-0 rounded-xl bg-surface-2 px-3 py-2.5">
                <dt className="text-[11px] text-muted">{item.label}</dt>
                <dd className="truncate text-[13.5px] font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          {variations.length > 0 && (
            <div>
              <p className="text-[12.5px] font-semibold text-ink-2">{optionName || "Options"}</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {variations.map((v) => (
                  <li key={v.id} className="rounded-lg border border-line px-2.5 py-1 text-[12px] text-ink-2">
                    {[v.option1, v.option2].filter(Boolean).join(" / ")} · <span className="font-semibold">{v.stock}</span> left
                    {v.price !== null && v.price !== product.price ? ` · ${naira(v.price)}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.description && <p className="line-clamp-4 whitespace-pre-line text-[13px] leading-relaxed text-muted">{product.description}</p>}

          {/* Everything you can do with it, spelled out. */}
          <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line">
            {actions.map(({ key, icon: Icon, label, hint, href, onClick }) => {
              const inner = (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-ink">{label}</span>
                    <span className="block text-[12px] text-muted">{hint}</span>
                  </span>
                  <ChevronRight size={17} className="shrink-0 text-subtle" />
                </>
              );
              const cls = "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2";
              return href ? (
                <Link key={key} href={href} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button key={key} type="button" onClick={onClick} className={cls}>
                  {inner}
                </button>
              );
            })}
            {product.status !== "ARCHIVED" && (
              <button
                type="button"
                onClick={() => (confirmArchive ? onArchive() : setConfirmArchive(true))}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  confirmArchive ? "bg-red-50 dark:bg-red-500/10" : "hover:bg-red-50/60 dark:hover:bg-red-500/5"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <Archive size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-red-700 dark:text-red-300">
                    {confirmArchive ? "Tap again to archive" : "Archive product"}
                  </span>
                  <span className="block text-[12px] text-muted">Takes it out of your shop. Past orders are kept.</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
