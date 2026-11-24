"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, BadgeCheck, Minus, Plus, ShieldCheck, ShoppingCart, Store, Trash2 } from "lucide-react";

import { useAuth } from "@/src/hooks/use-auth";
import { useGuestCart } from "@/src/store/guest-cart-store";
import { getGuestCartQuote } from "@/src/services/guest-checkout.services";
import { useIsClient } from "@/src/components/ui/cart-button";
import { rememberReturnTo } from "@/src/lib/return-to";
import { naira } from "@/src/lib/payment-link";
import Skeleton from "@/src/components/ui/skeleton";

// The cart of someone shopping without an account (kept in this browser).
// Signed-in buyers have theirs at /marketplace/cart.
export default function GuestCartPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const isClient = useIsClient();
  const lines = useGuestCart((state) => state.lines);
  const setQuantity = useGuestCart((state) => state.setQuantity);
  const remove = useGuestCart((state) => state.remove);

  // Signed in: their items move to the account cart (GuestCartSync).
  useEffect(() => {
    if (isHydrated && isAuthenticated) router.replace("/marketplace/cart");
  }, [isHydrated, isAuthenticated, router]);

  const { data: quote, isLoading } = useQuery({
    queryKey: ["guest-cart-quote", lines],
    queryFn: () => getGuestCartQuote(lines),
    select: (response) => response.data,
    enabled: isClient && lines.length > 0,
    placeholderData: (previous) => previous,
  });

  if (!isClient || (lines.length > 0 && isLoading && !quote)) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingCart size={30} className="mx-auto text-violet-500" />
        <p className="mt-3 text-[16px] font-semibold text-ink">Your cart is empty</p>
        <p className="mt-1.5 text-[13.5px] text-muted">Find something you love - you don&apos;t need an account to buy.</p>
        <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Browse Nestly
        </Link>
      </div>
    );
  }

  const items = quote?.items ?? [];
  const stores = quote?.stores ?? [];
  const isBlocked = (item: (typeof items)[number]) => !!item.problem || !!stores.find((s) => s.id === item.storeId)?.problem;
  const blocked = items.filter(isBlocked);
  const buyable = items.length - blocked.length;
  const count = items.filter((item) => !isBlocked(item)).reduce((sum, item) => sum + item.quantity, 0);
  const groups = [
    ...stores.map((store) => ({ store, items: items.filter((item) => item.storeId === store.id) })),
    ...(items.some((item) => !item.storeId) ? [{ store: null, items: items.filter((item) => !item.storeId) }] : []),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:pt-8">
      <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink">Your cart</h1>
      <p className="mt-1 text-[13px] text-muted">
        No account needed to check out.{" "}
        <Link
          href={`/login?returnTo=${encodeURIComponent("/marketplace/cart")}`}
          onClick={() => rememberReturnTo("/marketplace/cart")}
          className="font-semibold text-violet-700 hover:underline dark:text-violet-300"
        >
          Have an account? Log in
        </Link>{" "}
        - your cart comes with you.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0 space-y-4">
          {groups.map(({ store, items: storeItems }) => (
            <section key={store?.id ?? "gone"} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
              {store && (
                <Link href={`/marketplace/seller/${store.slug}`} className="mb-3 flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                  <Store size={15} className="text-violet-600 dark:text-violet-400" />
                  <span className="truncate">{store.name}</span>
                  {store.isVerified && <BadgeCheck size={14} className="shrink-0 text-violet-600" aria-label="Verified business" />}
                </Link>
              )}
              {store?.problem && (
                <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">{store.problem}</p>
              )}
              <ul className="divide-y divide-line-soft">
                {storeItems.map((item) => (
                  <li key={`${item.productId}:${item.variationId ?? ""}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <Link href={`/marketplace/product/${item.productId}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                      {item.image && <Image src={item.image} alt={item.title ?? ""} fill sizes="64px" className="object-cover" />}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/marketplace/product/${item.productId}`} className="line-clamp-2 text-[13.5px] font-semibold text-ink hover:underline">
                        {item.title ?? "Item no longer available"}
                      </Link>
                      {item.variantLabel && <p className="mt-0.5 text-[12px] text-muted">{item.variantLabel}</p>}
                      <p className="mt-1 font-[family-name:var(--font-mono)] text-[13.5px] font-semibold text-violet-700 dark:text-violet-300">
                        {naira(item.unitPrice)}
                      </p>
                      {item.problem && (
                        <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-red-600 dark:text-red-400">
                          <AlertCircle size={13} /> {item.problem}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-xl border border-line p-0.5">
                          <button
                            type="button"
                            aria-label="Fewer"
                            onClick={() => setQuantity(item.productId, item.variationId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-2 disabled:opacity-40"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center font-[family-name:var(--font-mono)] text-[13.5px] font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="More"
                            onClick={() => setQuantity(item.productId, item.variationId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-2 disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.productId, item.variationId)}
                          className="flex h-9 items-center gap-1 rounded-lg px-2 text-[12.5px] font-semibold text-muted hover:text-red-600"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="space-y-3 rounded-2xl border border-line bg-surface p-5">
            <div className="flex justify-between text-[13.5px]">
              <span className="text-muted">Items ({count})</span>
              <span className="font-[family-name:var(--font-mono)] text-ink">{naira(quote?.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between text-[13.5px]">
              <span className="text-muted">Delivery</span>
              <span className="text-ink-2">Chosen at checkout</span>
            </div>
            {blocked.length > 0 && buyable > 0 && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                {blocked.length} item{blocked.length === 1 ? "" : "s"} can&apos;t be bought right now and will be left out.
              </p>
            )}
            <Link
              href="/checkout/guest"
              aria-disabled={buyable === 0}
              className={`flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white transition-all hover:brightness-110 ${
                buyable === 0 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Check out
            </Link>
            <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-subtle">
              <ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-600" />
              Your money is held by Nestly until you get your order.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
