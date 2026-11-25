"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AlertCircle, BadgeCheck, Loader2, Lock, ShieldCheck, Store } from "lucide-react";

import { useAuth } from "@/src/hooks/use-auth";
import { useFormDraft } from "@/src/hooks/use-form-draft";
import { GuestCartLine, useGuestCart } from "@/src/store/guest-cart-store";
import { getGuestCartQuote, guestCheckout } from "@/src/services/guest-checkout.services";
import { verifyGuestOrder } from "@/src/services/payment-link.services";
import { payWithPaystack } from "@/src/lib/paystack";
import { trafficSource } from "@/src/lib/traffic-source";
import { referralCode } from "@/src/lib/referral";
import { rememberReturnTo } from "@/src/lib/return-to";
import { naira } from "@/src/lib/payment-link";
import { useIsClient } from "@/src/components/ui/cart-button";
import GuestDetails, { GuestDetailsValue, emptyGuest, guestProblem } from "@/src/components/guest-checkout/guest-details";
import DraftRestoredNotice from "@/src/components/ui/draft-restored-notice";
import Skeleton from "@/src/components/ui/skeleton";
import ZonePicker, { ZoneOption } from "@/src/app/(protected)/marketplace/checkout/components/zone-picker";
import { ApiErrorResponse } from "@/src/types/api";

const NOTE_MAX = 500;

// Checkout without an account: the browser cart (several items, several
// sellers, one payment) or Buy now on one product (?product=&qty=&variation=).
// After paying they land on their private order page, where they're offered
// a free account.
export default function GuestCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isHydrated } = useAuth();
  const isClient = useIsClient();
  const cartLines = useGuestCart((state) => state.lines);
  const removeFromCart = useGuestCart((state) => state.remove);

  // Buy now: just this item - the cart is left as it is.
  const buyNowId = searchParams.get("product");
  const buyNow = useMemo<GuestCartLine | null>(
    () =>
      buyNowId
        ? { productId: buyNowId, variationId: searchParams.get("variation"), quantity: Math.max(1, Number(searchParams.get("qty")) || 1) }
        : null,
    [buyNowId, searchParams]
  );
  // Several items from a link (a collection): ?items=productId.variationId.qty,...
  // (variationId empty when there's none) - the cart is left as it is too.
  const itemsParam = searchParams.get("items");
  const linkLines = useMemo<GuestCartLine[] | null>(() => {
    if (buyNow) return [buyNow];
    if (!itemsParam) return null;
    const parsed = itemsParam
      .split(",")
      .map((part) => part.split("."))
      .filter(([productId]) => !!productId)
      .map(([productId, variationId, qty]) => ({ productId, variationId: variationId || null, quantity: Math.max(1, Number(qty) || 1) }));
    return parsed.length ? parsed : null;
  }, [buyNow, itemsParam]);
  // Where "back" goes for items from a link (e.g. the collection page).
  const back = searchParams.get("back");
  const lines = useMemo(() => linkLines ?? cartLines, [linkLines, cartLines]);

  // Signed in: the normal checkout.
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    router.replace(buyNow ? `/marketplace/product/${buyNow.productId}` : back?.startsWith("/") ? back : "/marketplace/cart");
  }, [isHydrated, isAuthenticated, buyNow, back, router]);

  const { data: quote, isLoading } = useQuery({
    queryKey: ["guest-cart-quote", lines],
    queryFn: () => getGuestCartQuote(lines),
    select: (response) => response.data,
    enabled: isClient && lines.length > 0,
  });

  const [guest, setGuest] = useState<GuestDetailsValue>(emptyGuest);
  // Delivery zone / pickup point chosen for each seller.
  const [zones, setZones] = useState<Record<string, ZoneOption>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const attemptRef = useRef(0);

  const { restored, clear: clearSaved, dismissNotice } = useFormDraft(
    "guest-checkout",
    { guest, notes },
    (saved) => {
      setGuest({ ...emptyGuest, ...saved.guest });
      setNotes(saved.notes ?? {});
    },
    {
      guest: true,
      isEmpty: (value) => JSON.stringify(value.guest) === JSON.stringify(emptyGuest) && !Object.values(value.notes ?? {}).some((n) => n.trim()),
    }
  );

  if (!isClient || (lines.length > 0 && isLoading && !quote)) {
    return (
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">Your cart is empty</p>
        <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Browse Nestly
        </Link>
      </div>
    );
  }

  const stores = (quote?.stores ?? []).filter((store) => !store.problem);
  // Only what can be bought now; the cart page says what's left out.
  const items = (quote?.items ?? []).filter((item) => !item.problem && stores.some((store) => store.id === item.storeId));
  const groups = stores
    .map((store) => ({ store, items: items.filter((item) => item.storeId === store.id) }))
    .filter((group) => group.items.length > 0);
  const leftOut = (quote?.items.length ?? 0) - items.length;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const chosen = groups.map((group) => zones[group.store.id]).filter(Boolean);
  const allChosen = chosen.length === groups.length;
  const deliveryFee = chosen.reduce((sum, zone) => sum + zone.fee, 0);
  const total = subtotal + deliveryFee;
  // Everything picked up: no address needed.
  const needsAddress = !(allChosen && chosen.every((zone) => zone.type === "PICKUP"));
  const returnTo = buyNow ? `/marketplace/product/${buyNow.productId}` : back?.startsWith("/") ? back : "/marketplace/cart";

  const pay = async () => {
    if (groups.length === 0) return setError("Nothing in your cart can be bought right now.");
    const missing = groups.find((group) => !zones[group.store.id]);
    if (missing) return setError(`Choose delivery or pickup for ${missing.store.name}.`);
    const problem = guestProblem(guest, needsAddress);
    if (problem) return setError(problem);

    const attempt = ++attemptRef.current;
    const isStale = () => attempt !== attemptRef.current;
    setError("");
    setAccountExists(false);
    setProcessing(true);

    try {
      const { data } = await guestCheckout({
        items: items.map(({ productId, variationId, quantity }) => ({ productId, variationId, quantity })),
        name: guest.name.trim(),
        email: guest.email.trim(),
        phone: guest.phone.trim(),
        ...(needsAddress ? { address: guest.address.trim(), city: guest.city.trim(), state: guest.state } : {}),
        shippingSelections: groups.map((group) => ({ storeId: group.store.id, shippingOptionId: zones[group.store.id].id })),
        sellerNotes: Object.entries(notes)
          .filter(([storeId, note]) => note.trim() && groups.some((group) => group.store.id === storeId))
          .map(([storeId, note]) => ({ storeId, note: note.trim() })),
        source: trafficSource(),
        referralCode: referralCode(),
      });
      await payWithPaystack(data.accessCode, {
        onSuccess: async () => {
          clearSaved();
          // What was bought leaves the cart (Buy now leaves the cart alone).
          if (!linkLines) items.forEach((item) => removeFromCart(item.productId, item.variationId));
          await verifyGuestOrder(data.guestToken).catch(() => undefined);
          if (!isStale()) router.push(`/orders/track/${data.guestToken}?welcome=1`);
        },
        onCancel: () => {
          if (!isStale()) setProcessing(false);
        },
        onError: (message) => {
          if (!isStale()) {
            setError(message || "Payment failed. Please try again.");
            setProcessing(false);
          }
        },
      });
    } catch (err) {
      if (isStale()) return;
      const response = (err as AxiosError<ApiErrorResponse>).response;
      if (response?.status === 409) setAccountExists(true);
      setError(response?.data?.message ?? "Couldn't start the payment. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:pt-8">
      <div className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-emerald-700 dark:text-emerald-300">
        <Lock size={14} /> Secure checkout · Nestly
      </div>
      <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink">Checkout</h1>
      <p className="mt-1 text-[13px] text-muted">No account needed - we&apos;ll email your receipt and delivery code.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="min-w-0 space-y-5">
          {restored && <DraftRestoredNotice what="the details you entered" onStartOver={() => { setGuest(emptyGuest); setNotes({}); clearSaved(); }} onDismiss={dismissNotice} />}
          {leftOut > 0 && (
            <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-[12.5px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              {leftOut} item{leftOut === 1 ? "" : "s"} can&apos;t be bought right now and {leftOut === 1 ? "is" : "are"} left out.{" "}
              {!linkLines && (
                <Link href="/cart" className="font-semibold underline">
                  See your cart
                </Link>
              )}
            </p>
          )}

          <GuestDetails value={guest} onChange={setGuest} needsAddress={needsAddress} returnTo={returnTo} />

          {groups.map(({ store, items: storeItems }) => (
            <section key={store.id} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                <Store size={15} className="text-violet-600 dark:text-violet-400" />
                <span className="truncate">{store.name}</span>
                {store.isVerified && <BadgeCheck size={14} className="shrink-0 text-violet-600" aria-label="Verified business" />}
              </p>
              <ul className="space-y-3">
                {storeItems.map((item) => (
                  <li key={`${item.productId}:${item.variationId ?? ""}`} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                      {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13px] font-semibold text-ink">{item.title}</p>
                      {item.variantLabel && <p className="text-[12px] text-muted">{item.variantLabel}</p>}
                      <p className="text-[12.5px] text-ink-2">
                        {item.quantity} × {naira(item.unitPrice)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-dashed border-line pt-4">
                <p className="mb-2.5 text-[13px] font-semibold text-ink-2">How do you want to get it?</p>
                <ZonePicker
                  storeName={store.name}
                  storeAddress=""
                  zones={store.shippingOptions}
                  needed="BIKE"
                  selectedId={zones[store.id]?.id}
                  onSelect={(zone) => setZones((current) => ({ ...current, [store.id]: zone }))}
                  onClear={() =>
                    setZones((current) => {
                      const next = { ...current };
                      delete next[store.id];
                      return next;
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor={`note-${store.id}`} className="text-[12.5px] font-medium text-ink-2">
                  Note for {store.name} (optional)
                </label>
                <textarea
                  id={`note-${store.id}`}
                  value={notes[store.id] ?? ""}
                  onChange={(e) => setNotes((current) => ({ ...current, [store.id]: e.target.value.slice(0, NOTE_MAX) }))}
                  rows={2}
                  placeholder="e.g. call before you come"
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
                />
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="space-y-3 rounded-2xl border border-line bg-surface p-5">
            <dl className="space-y-2 text-[13.5px]">
              <div className="flex justify-between">
                <dt className="text-muted">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</dt>
                <dd className="font-[family-name:var(--font-mono)] text-ink">{naira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="font-[family-name:var(--font-mono)] text-ink">{allChosen ? (deliveryFee > 0 ? naira(deliveryFee) : "Free") : "Choose for each seller"}</dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-line pt-2.5 text-[15px] font-semibold">
                <dt className="text-ink">Total</dt>
                <dd className="font-[family-name:var(--font-mono)] text-violet-700 dark:text-violet-300">{naira(total)}</dd>
              </div>
            </dl>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>
                  {error}
                  {accountExists && (
                    <>
                      {" "}
                      <Link
                        href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
                        onClick={() => rememberReturnTo(returnTo)}
                        className="font-semibold underline"
                      >
                        Log in
                      </Link>
                      {linkLines ? "" : " - your cart comes with you."}
                    </>
                  )}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={pay}
              disabled={processing || groups.length === 0}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
            >
              {processing ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Pay {naira(total)} securely
            </button>
            <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-subtle">
              <ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-600" />
              Nestly holds your money until you get your order. By paying, you agree to Nestly&apos;s{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
