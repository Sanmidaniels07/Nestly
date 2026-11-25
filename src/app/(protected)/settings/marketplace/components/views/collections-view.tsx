"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Layers, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useMyStore } from "@/src/hooks/use-my-store";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { useCreateCollection, useDeleteCollection, useMyCollections, useUpdateCollection } from "@/src/hooks/use-collections";
import { collectionShareUrl, displayUrl } from "@/src/lib/store-link";
import { shareLinks } from "@/src/lib/social";
import { WhatsAppIcon } from "@/src/components/ui/social-icons";
import { SellerCollection } from "@/src/types/collection";
import { Product } from "@/src/types/product";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
const MAX_PRODUCTS = 50;
const LISTED = ["PUBLISHED", "OUT_OF_STOCK"];

// Products -> Collections: hand-pick products, get one link. Buyers who open
// it see just those, choose quantities and check out once.
export default function CollectionsView() {
  const { data: store } = useMyStore();
  const { data: collections, isLoading } = useMyCollections();
  const [editing, setEditing] = useState<SellerCollection | "new" | null>(null);

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="min-w-0 max-w-xl">
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-fraunces)] text-[22px] text-ink">
            <Layers size={20} className="text-violet-600 dark:text-violet-400" /> Collections
          </h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
            Pick a few products - say, &ldquo;Owambe outfits&rdquo; or &ldquo;New this week&rdquo; - and share one link. Buyers see just those,
            choose what they want and pay once. No account needed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-[14px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(91,33,182,0.7)] transition hover:brightness-110"
        >
          <Plus size={17} /> New collection
        </button>
      </section>

      {isLoading && <div className="h-40 animate-pulse rounded-2xl bg-surface-2" />}

      {!isLoading && collections?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-6 py-12 text-center">
          <Layers className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-semibold text-ink">No collections yet</p>
          <p className="mt-1 text-[13px] text-muted">Make your first one - it takes a minute.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {collections?.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} storeSlug={store?.slug ?? ""} onEdit={() => setEditing(collection)} />
        ))}
      </div>

      {editing && <CollectionEditor collection={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function CollectionCard({ collection, storeSlug, onEdit }: { collection: SellerCollection; storeSlug: string; onEdit: () => void }) {
  const { mutate: update, isPending: isSwitching } = useUpdateCollection();
  const { mutate: remove, isPending: isDeleting } = useDeleteCollection();
  const [copied, setCopied] = useState(false);
  const url = collectionShareUrl(storeSlug, collection.slug);
  const notListed = collection.products.filter((product) => !LISTED.includes(product.status)).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy - select the link and copy it");
    }
  };

  return (
    <article className={`rounded-2xl border bg-surface p-5 transition-colors ${collection.isActive ? "border-line" : "border-dashed border-line-strong opacity-80"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold text-ink">{collection.name}</h3>
          <p className="text-[12.5px] text-muted">
            {collection.products.length} product{collection.products.length === 1 ? "" : "s"}
            {notListed > 0 && <span className="text-amber-700 dark:text-amber-300"> · {notListed} not in your shop any more</span>}
          </p>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-muted">
          {collection.isActive ? "On" : "Off"}
          <button
            type="button"
            role="switch"
            aria-checked={collection.isActive}
            aria-label={collection.isActive ? "Switch off" : "Switch on"}
            disabled={isSwitching}
            onClick={() => update({ id: collection.id, data: { isActive: !collection.isActive } })}
            className={`relative h-6 w-11 rounded-full transition-colors ${collection.isActive ? "bg-violet-600" : "bg-track"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${collection.isActive ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </label>
      </div>

      <div className="mt-3 flex -space-x-2">
        {collection.products.slice(0, 5).map((product) => (
          <span key={product.id} className="relative h-11 w-11 overflow-hidden rounded-xl border-2 border-surface bg-surface-2">
            {product.image && <Image src={product.image} alt="" fill sizes="44px" className="object-cover" />}
          </span>
        ))}
        {collection.products.length > 5 && (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-surface bg-surface-2 text-[12px] font-semibold text-muted">
            +{collection.products.length - 5}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 p-1.5 pl-3">
        <p className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink-2">{displayUrl(url)}</p>
        <button type="button" onClick={copy} className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12.5px] font-semibold text-white hover:bg-violet-700">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={shareLinks(url, `${collection.name} - shop it on Nestly:`).whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[12.5px] font-semibold text-ink-2 hover:border-emerald-300"
        >
          <WhatsAppIcon size={15} className="text-emerald-600" /> WhatsApp
        </a>
        <Link href={url.replace(/^https?:\/\/[^/]+/, "")} target="_blank" className="flex h-9 items-center rounded-lg border border-line px-3 text-[12.5px] font-semibold text-ink-2 hover:border-violet-300">
          View
        </Link>
        <button type="button" onClick={onEdit} className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[12.5px] font-semibold text-ink-2 hover:border-violet-300">
          <Pencil size={13} /> Edit
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => window.confirm(`Delete "${collection.name}"? Its link stops working. Your products stay as they are.`) && remove(collection.id)}
          className="ml-auto flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </article>
  );
}

function CollectionEditor({ collection, onClose }: { collection: SellerCollection | null; onClose: () => void }) {
  const { data: productsData, isLoading } = useMyProducts({ limit: 100 });
  const { mutate: create, isPending: isCreating } = useCreateCollection();
  const { mutate: update, isPending: isUpdating } = useUpdateCollection();
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  // In the order they were picked - that's the order buyers see.
  const [picked, setPicked] = useState<string[]>(collection?.products.filter((p) => LISTED.includes(p.status)).map((p) => p.id) ?? []);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const busy = isCreating || isUpdating;

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

  const listed = useMemo(
    () => (productsData?.products ?? []).filter((product: Product) => LISTED.includes(product.status)),
    [productsData]
  );
  const shown = listed.filter((product) => product.title.toLowerCase().includes(query.trim().toLowerCase()));

  const toggle = (id: string) => {
    setError("");
    setPicked((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : current.length >= MAX_PRODUCTS ? current : [...current, id]
    );
  };

  const save = () => {
    if (name.trim().length < 2) return setError("Give the collection a name.");
    if (picked.length === 0) return setError("Pick at least one product.");
    const data = { name: name.trim(), description: description.trim() || null, productIds: picked };
    if (collection) update({ id: collection.id, data }, { onSuccess: () => { toast.success("Collection saved"); onClose(); } });
    else create(data, { onSuccess: onClose });
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={collection ? "Edit collection" : "New collection"}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-xl flex-col rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] text-ink">{collection ? "Edit collection" : "New collection"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <label className="block">
            <span className="text-[13px] font-semibold text-ink-2">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. Owambe outfits"
              className="mt-1.5 h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] text-ink outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
            />
            {collection && <span className="mt-1 block text-[11.5px] text-subtle">The link stays the same if you rename it.</span>}
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold text-ink-2">
              A line for buyers <span className="font-normal text-subtle">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={2}
              placeholder="e.g. Ready to wear for this weekend - order by Thursday"
              className="mt-1.5 w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
            />
          </label>

          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-ink-2">Products</span>
              <span className="text-[12.5px] font-semibold text-violet-700 dark:text-violet-300">{picked.length} picked</span>
            </div>
            <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3">
              <Search size={16} className="text-subtle" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your products"
                className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-subtle sm:text-[14px]"
              />
            </div>
            <ul className="mt-2 divide-y divide-line-soft overflow-hidden rounded-xl border border-line">
              {isLoading && <li className="px-4 py-6 text-center text-[13px] text-muted">Loading your products...</li>}
              {!isLoading && listed.length === 0 && (
                <li className="px-4 py-6 text-center text-[13px] text-muted">Publish some products first - only products in your shop can go in a collection.</li>
              )}
              {shown.map((product) => {
                const index = picked.indexOf(product.id);
                const on = index >= 0;
                const image = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url;
                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => toggle(product.id)}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${on ? "bg-violet-50 dark:bg-violet-500/10" : "hover:bg-surface-2"}`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold ${
                          on ? "border-violet-600 bg-violet-600 text-white" : "border-line-strong text-transparent"
                        }`}
                      >
                        {on ? index + 1 : "·"}
                      </span>
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                        {image && <Image src={image} alt="" fill sizes="44px" className="object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-ink">{product.title}</span>
                        <span className="block text-[12px] text-muted">
                          {naira(product.price)}
                          {product.status === "OUT_OF_STOCK" && " · sold out"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-1.5 text-[11.5px] text-subtle">Buyers see them in the order you pick them. Up to {MAX_PRODUCTS}.</p>
          </div>
        </div>

        <div className="border-t border-line-soft px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {error && <p className="mb-2 text-[12.5px] text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {collection ? "Save changes" : "Create collection"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
