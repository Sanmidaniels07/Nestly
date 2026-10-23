"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ExternalLink, History, Package, Search, Star } from "lucide-react";

import { useAdminProducts, useProductHistory } from "@/src/hooks/use-admin-products";
import { AdminProduct, ProductChange } from "@/src/types/admin-product";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";

const STATUS_TONE: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  DRAFT: "bg-surface-2 text-ink-2",
  OUT_OF_STOCK: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  ARCHIVED: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

const statusLabel = (status: string) => status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");

const fullDate = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

// Find any product (drafts and archived too) and see every edit its seller
// has saved - for disputes and spotting listings that were switched around.
export default function ProductsManager() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useAdminProducts({ search: search || undefined, page, limit: 15 });
  const products = data?.products ?? [];

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by product title, SKU or store"
          aria-label="Search products"
          className="h-12 w-full rounded-2xl border border-line bg-surface pl-11 pr-4 text-[14px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <Package className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-subtle">{search ? `No products match "${search}".` : "No products yet."}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              open={openId === product.id}
              onToggle={() => setOpenId(openId === product.id ? null : product.id)}
            />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  );
}

function ProductRow({ product, open, onToggle }: { product: AdminProduct; open: boolean; onToggle: () => void }) {
  const cover = product.images[0]?.url;
  const edits = product._count.revisions;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3.5 p-3.5 text-left transition-colors hover:bg-surface-sunken sm:p-4"
      >
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-ink">{product.title}</p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted">
            {product.store.name} · <span className="font-[family-name:var(--font-mono)]">{product.sku}</span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_TONE[product.status] ?? STATUS_TONE.DRAFT}`}>
              {statusLabel(product.status)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <History size={11} /> {edits} edit{edits === 1 ? "" : "s"}
            </span>
            {product.reviewsResetAt && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <Star size={11} /> Reviews reset
              </span>
            )}
          </div>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <HistoryPanel productId={product.id} />}
    </div>
  );
}

function HistoryPanel({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProductHistory(productId, page);

  return (
    <div className="border-t border-line bg-surface-sunken px-3.5 py-4 sm:px-5">
      {data && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-muted">
          <span>Listed {fullDate(data.product.createdAt)}</span>
          <Link
            href={`/marketplace/product/${productId}`}
            target="_blank"
            className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:underline dark:text-violet-300"
          >
            Open listing <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      ) : !data || data.revisions.length === 0 ? (
        <p className="py-4 text-center text-[13px] text-subtle">No edits since it was listed.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-line pl-5">
          {data.revisions.map((revision) => (
            <li key={revision.id} className="relative">
              <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-violet-500" />
              <p className="text-[12.5px] text-muted">
                <span className="font-semibold text-ink">{fullDate(revision.createdAt)}</span>
                <span className="text-subtle"> · {formatRelativeTime(revision.createdAt)}</span>
                {revision.editedBy && <> · by {revision.editedBy.name}</>}
              </p>
              {revision.reviewsReset && (
                <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <Star size={11} /> Became a different product - earlier reviews labelled
                </p>
              )}
              <div className="mt-2 space-y-2">
                {revision.changes.map((change) => (
                  <ChangeRow key={change.field} change={change} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-4">
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

const LONG = 140;

function ChangeRow({ change }: { change: ProductChange }) {
  const [expanded, setExpanded] = useState(false);

  if (change.field === "Photos") {
    const before = (change.from as string[] | null) ?? [];
    const after = (change.to as string[] | null) ?? [];
    return (
      <div className="rounded-xl border border-line bg-surface p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Photos</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Thumbs urls={before} faded />
          <ArrowRight size={14} className="shrink-0 text-subtle" />
          <Thumbs urls={after} />
        </div>
      </div>
    );
  }

  // Status and condition are stored as codes (OUT_OF_STOCK, FRESHLY_MADE).
  const readable = (value: string | null) =>
    value && (change.field === "Status" || change.field === "Condition") ? statusLabel(value) : value ?? "";
  const from = readable(change.from as string | null);
  const to = readable(change.to as string | null);
  const isLong = from.length > LONG || to.length > LONG;
  const clip = (text: string) => (isLong && !expanded && text.length > LONG ? `${text.slice(0, LONG).trimEnd()}…` : text);

  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{change.field}</p>
      <div className="mt-1.5 grid gap-1.5 text-[13px] leading-relaxed sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-start">
        <p className="whitespace-pre-line text-muted line-through decoration-red-400/70 [overflow-wrap:anywhere]">
          {from ? clip(from) : <span className="no-underline">(empty)</span>}
        </p>
        <ArrowRight size={14} className="hidden shrink-0 text-subtle sm:mt-1 sm:block" />
        <p className="whitespace-pre-line font-medium text-ink [overflow-wrap:anywhere]">{to ? clip(to) : "(empty)"}</p>
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1.5 text-[12px] font-semibold text-violet-700 hover:underline dark:text-violet-300"
        >
          {expanded ? "Show less" : "Show all"}
        </button>
      )}
    </div>
  );
}

function Thumbs({ urls, faded }: { urls: string[]; faded?: boolean }) {
  if (urls.length === 0) return <span className="text-[12.5px] text-subtle">(none)</span>;
  return (
    <div className={`flex flex-wrap gap-1.5 ${faded ? "opacity-50" : ""}`}>
      {urls.map((url, index) => (
        <a key={`${url}-${index}`} href={url} target="_blank" rel="noopener noreferrer" className="block h-12 w-12 overflow-hidden rounded-lg border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={index === 0 ? "Cover photo" : `Photo ${index + 1}`} className="h-full w-full object-cover" />
        </a>
      ))}
    </div>
  );
}
