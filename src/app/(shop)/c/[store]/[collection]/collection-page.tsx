"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BadgeCheck, Check, Layers, Loader2, Lock, MapPin, Minus, Plus, ShieldCheck, Store } from "lucide-react";
import toast from "react-hot-toast";

import { getPublicCollection } from "@/src/services/collection.services";
import { addToCart } from "@/src/services/cart.services";
import { useAuth } from "@/src/hooks/use-auth";
import BrandScope from "@/src/components/ui/brand-scope";
import Skeleton from "@/src/components/ui/skeleton";
import OptionPicker from "@/src/app/(shop)/marketplace/product/[id]/components/buy-box-components/option-picker";
import { ApiErrorResponse, ApiResponse } from "@/src/types/api";
import { CollectionProduct, PublicCollection } from "@/src/types/collection";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

interface Props {
  store: string;
  slug: string;
  initial?: ApiResponse<PublicCollection>;
}

interface Pick {
  quantity: number;
  // Chosen option values (e.g. ["M", "Black"]).
  values: string[];
}

// The product's variation for the chosen values, if it has options.
const variationFor = (product: CollectionProduct, values: string[]) =>
  product.options.length === 0
    ? null
    : product.variations.find(
        (v) => v.isActive && v.option1 === values[0] && (product.options.length < 2 || v.option2 === values[1])
      ) ?? null;

const lowestPrice = (product: CollectionProduct) => {
  const prices = product.variations.filter((v) => v.isActive && v.stock > 0).map((v) => v.price ?? product.price);
  return prices.length ? Math.min(...prices) : product.price;
};

// What buyers see at nestlyapp.site/{store}/{collection}: just the products
// the seller picked, with prices. Tap to add, choose sizes/colours where
// there are any, set quantities, then one checkout and one payment - with
// or without an account.
export default function CollectionPage({ store, slug, initial }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [picks, setPicks] = useState<Record<string, Pick>>({});
  const [busy, setBusy] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["collection", store, slug],
    queryFn: () => getPublicCollection(store, slug),
    initialData: initial?.data,
    staleTime: 15_000,
  });

  if (isLoading && !data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-1 py-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <Layers className="mx-auto h-9 w-9 text-faint" strokeWidth={1.5} />
        <p className="mt-4 text-[16px] font-semibold text-ink">This collection isn&apos;t here any more</p>
        <p className="mt-1.5 text-[13.5px] text-muted">The seller may have removed it. Ask them for a new link.</p>
        <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Browse Nestly
        </Link>
      </div>
    );
  }

  const location = [...new Set([data.store.city, data.store.state].filter(Boolean))].join(", ");
  const chosen = data.products
    .map((product) => ({ product, pick: picks[product.id] }))
    .filter((entry): entry is { product: CollectionProduct; pick: Pick } => !!entry.pick && entry.pick.quantity > 0);
  const lines = chosen.map(({ product, pick }) => {
    const variation = variationFor(product, pick.values);
    return { product, pick, variation, unit: variation?.price ?? product.price };
  });
  const needsChoice = lines.find(({ product, variation }) => product.options.length > 0 && !variation);
  const count = lines.reduce((sum, line) => sum + line.pick.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.unit * line.pick.quantity, 0);

  const setPick = (id: string, next: Pick | null) =>
    setPicks((current) => {
      const copy = { ...current };
      if (!next || next.quantity <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });

  const checkout = async () => {
    if (needsChoice) {
      toast.error(`Choose ${needsChoice.product.options.map((o) => o.name.toLowerCase()).join(" and ")} for "${needsChoice.product.title}".`);
      document.getElementById(`item-${needsChoice.product.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const items = lines.map(({ product, pick, variation }) => ({ productId: product.id, variationId: variation?.id ?? null, quantity: pick.quantity }));

    // No account: the guest checkout, with just these items.
    if (!isAuthenticated) {
      const param = items.map((item) => `${item.productId}.${item.variationId ?? ""}.${item.quantity}`).join(",");
      router.push(`/checkout/guest?items=${encodeURIComponent(param)}&back=${encodeURIComponent(pathname)}`);
      return;
    }

    // Signed in: into their cart, then the usual checkout.
    setBusy(true);
    try {
      for (const item of items) await addToCart({ productId: item.productId, quantity: item.quantity, variationId: item.variationId ?? undefined });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/marketplace/checkout");
    } catch (error) {
      toast.error((error as AxiosError<ApiErrorResponse>).response?.data?.message ?? "Couldn't add those to your cart. Please try again.");
      setBusy(false);
    }
  };

  return (
    <BrandScope color={data.store.brandColor}>
      <div className="mx-auto max-w-3xl space-y-5 px-1 pb-40 pt-4 sm:pt-6">
        {/* Who's selling, and what this is */}
        <section className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="h-2 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600" />
          <div className="p-5 sm:p-6">
            <Link href={`/marketplace/seller/${data.store.slug}`} className="inline-flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                {data.store.logo ? <Image src={data.store.logo} alt="" fill sizes="36px" className="object-cover" /> : <Store size={16} />}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-[13.5px] font-semibold text-ink">
                  {data.store.name}
                  {data.store.isVerified && <BadgeCheck size={15} className="text-violet-600" aria-label="Verified business" />}
                </span>
                {location && (
                  <span className="flex items-center gap-1 text-[11.5px] text-muted">
                    <MapPin size={11} /> {location}
                  </span>
                )}
              </span>
            </Link>
            <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-[30px] leading-tight text-ink sm:text-[36px]">{data.name}</h1>
            {data.description && <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{data.description}</p>}
            {data.isActive && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <ShieldCheck size={13} /> Pay once for everything - your money is held until you get your order
              </p>
            )}
          </div>
        </section>

        {!data.isActive && (
          <div className="rounded-2xl border border-line bg-surface px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-ink">This collection isn&apos;t available right now</p>
            <p className="mt-1 text-[13px] text-muted">The seller has paused it. Their other products are in their shop.</p>
            <Link
              href={`/marketplace/seller/${data.store.slug}`}
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-violet-600 px-5 text-[14px] font-semibold text-white hover:bg-violet-700"
            >
              Visit {data.store.name}
            </Link>
          </div>
        )}

        {data.isActive && !data.store.canDeliver && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            This seller hasn&apos;t set up delivery or pickup yet, so orders can&apos;t be placed for now.
          </p>
        )}

        <ul className="space-y-3">
          {data.products.map((product) => (
            <ProductRow key={product.id} product={product} pick={picks[product.id]} onChange={(next) => setPick(product.id, next)} />
          ))}
        </ul>
      </div>

      {/* Always in reach: how many, the total, and one checkout. */}
      {data.isActive && (
        <div
          className={`fixed inset-x-0 z-40 px-3 ${isAuthenticated ? "bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] lg:bottom-4 lg:left-[264px]" : "bottom-[max(0.75rem,env(safe-area-inset-bottom))]"}`}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-line bg-surface/95 p-3 pl-4 shadow-[0_18px_48px_-12px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-muted">{count === 0 ? "Tap Add on what you want" : `${count} item${count === 1 ? "" : "s"}`}</p>
              <p className="font-[family-name:var(--font-mono)] text-[18px] font-semibold text-ink">{naira(total)}</p>
            </div>
            <button
              type="button"
              onClick={checkout}
              disabled={count === 0 || busy || !data.store.canDeliver}
              className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(91,33,182,0.7)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
              Check out
            </button>
          </div>
        </div>
      )}
    </BrandScope>
  );
}

function ProductRow({ product, pick, onChange }: { product: CollectionProduct; pick?: Pick; onChange: (next: Pick | null) => void }) {
  const image = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url;
  const hasOptions = product.options.length > 0;
  const values = pick?.values ?? [];
  const variation = variationFor(product, values);
  const unit = variation?.price ?? (hasOptions ? lowestPrice(product) : product.price);
  const max = variation ? variation.stock : hasOptions ? 99 : product.stock;
  const quantity = pick?.quantity ?? 0;
  const prices = product.variations.filter((v) => v.isActive).map((v) => v.price ?? product.price);
  const varies = hasOptions && !variation && new Set(prices).size > 1;

  return (
    <li
      id={`item-${product.id}`}
      className={`scroll-mt-24 rounded-2xl border bg-surface p-3 transition-colors sm:p-4 ${quantity > 0 ? "border-violet-300 dark:border-violet-500/40" : "border-line"}`}
    >
      <div className="flex gap-3">
        <Link href={`/marketplace/product/${product.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:h-28 sm:w-28">
          {image && <Image src={image} alt={product.title} fill sizes="112px" className="object-cover" />}
          {product.soldOut && (
            <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[11px] font-semibold text-white">Sold out</span>
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <Link href={`/marketplace/product/${product.id}`} className="line-clamp-2 text-[14.5px] font-semibold leading-snug text-ink hover:underline">
            {product.title}
          </Link>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[16px] font-semibold text-violet-700 dark:text-violet-300">
            {varies && <span className="mr-1 text-[12px] font-medium text-muted">From</span>}
            {naira(unit)}
            {product.originalPrice && product.originalPrice > unit && !hasOptions && (
              <span className="ml-2 text-[12.5px] font-normal text-subtle line-through">{naira(product.originalPrice)}</span>
            )}
          </p>
          <div className="mt-auto flex items-center justify-end pt-2">
            {product.soldOut ? (
              <span className="text-[12.5px] font-medium text-muted">Sold out</span>
            ) : quantity === 0 ? (
              <button
                type="button"
                onClick={() => onChange({ quantity: 1, values: [] })}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-[13.5px] font-semibold text-white transition hover:bg-violet-700 active:scale-[0.97]"
              >
                <Plus size={16} /> Add
              </button>
            ) : (
              <div className="flex items-center gap-1 rounded-xl border border-violet-300 bg-violet-50 p-1 dark:border-violet-500/40 dark:bg-violet-500/10">
                <button
                  type="button"
                  aria-label={quantity === 1 ? "Remove" : "Fewer"}
                  onClick={() => onChange(quantity === 1 ? null : { quantity: quantity - 1, values })}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-700 hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-500/20"
                >
                  <Minus size={15} />
                </button>
                <span className="w-7 text-center text-[14px] font-semibold text-ink" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="More"
                  disabled={quantity >= max}
                  onClick={() => onChange({ quantity: quantity + 1, values })}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-700 hover:bg-violet-100 disabled:opacity-40 dark:text-violet-300 dark:hover:bg-violet-500/20"
                >
                  <Plus size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sizes, colours...: chosen once it's added. */}
      {hasOptions && quantity > 0 && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <OptionPicker
            options={product.options}
            variations={product.variations}
            picked={values}
            onPick={(position, value) => {
              const next = [...values];
              next[position] = value;
              const nextVariation = variationFor(product, next);
              onChange({ quantity: nextVariation ? Math.min(quantity, Math.max(1, nextVariation.stock)) : quantity, values: next });
            }}
          />
          {variation ? (
            <p className="mt-2 flex items-center gap-1 text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
              <Check size={13} /> {variation.stock} available
            </p>
          ) : (
            <p className="mt-2 text-[12px] text-amber-700 dark:text-amber-300">Choose {product.options.map((o) => o.name.toLowerCase()).join(" and ")}</p>
          )}
        </div>
      )}
    </li>
  );
}
