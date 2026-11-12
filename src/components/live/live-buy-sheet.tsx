"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Lock, Minus, Plus, Truck, X } from "lucide-react";

import { useProduct } from "@/src/hooks/use-product";
import { useBuyFromLive } from "@/src/hooks/use-lives";
import { useVerifyCheckout } from "@/src/hooks/use-verify-checkout";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { payWithPaystack } from "@/src/lib/paystack";
import { trafficSource } from "@/src/lib/traffic-source";
import { PHONE_PATTERN } from "@/src/lib/phone";
import { naira } from "@/src/lib/payment-link";
import Skeleton from "@/src/components/ui/skeleton";
import OptionPicker from "@/src/app/(shop)/marketplace/product/[id]/components/buy-box-components/option-picker";
import ShippingAddress from "@/src/app/(protected)/marketplace/checkout/components/shipping-address";
import ZonePicker, { ZoneOption } from "@/src/app/(protected)/marketplace/checkout/components/zone-picker";
import { PublicLive } from "@/src/types/live";

// Buying a featured product without leaving the live: pick the option and
// quantity, the address and delivery zone, then pay in the Paystack pop-up.
// The video keeps playing behind it.

interface Props {
  live: PublicLive;
  productId: string;
  onClose: () => void;
}

export default function LiveBuySheet({ live, productId, onClose }: Props) {
  const featured = live.products.find((item) => item.id === productId);
  const { data: product, isLoading } = useProduct(productId);
  const addressId = useCheckoutStore((state) => state.addressId);
  const deliveryPhone = useCheckoutStore((state) => state.deliveryPhone?.trim() || undefined);
  const { mutateAsync: startPayment } = useBuyFromLive();
  const { mutateAsync: verifyCheckout } = useVerifyCheckout();

  const options = useMemo(() => product?.options ?? [], [product]);
  const variations = useMemo(() => (product?.variations ?? []).filter((variation) => variation.isActive), [product]);
  const hasOptions = options.length > 0 && variations.length > 0;
  const [picked, setPicked] = useState<string[]>(["", ""]);
  const [quantity, setQuantity] = useState(1);
  const [zone, setZone] = useState<ZoneOption | null>(null);
  const clearZone = useCallback(() => setZone(null), []);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paidOrderId, setPaidOrderId] = useState<string | null>(null);
  const attemptRef = useRef(0);

  // Close on Escape.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && !processing && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, processing]);

  const match = hasOptions
    ? variations.find((variation) => variation.option1 === picked[0] && (options.length < 2 || variation.option2 === picked[1]))
    : undefined;
  const choiceMade = !hasOptions || !!match;
  const listPrice = match?.price ?? product?.price ?? featured?.price ?? 0;
  const discount = live.discountActive ? featured?.discountPercent ?? null : null;
  const unitPrice = discount ? Math.round(listPrice * (1 - discount / 100)) : listPrice;
  const stock = match ? match.stock : product?.stock ?? 0;
  const qty = Math.max(1, Math.min(quantity, stock || 1, 20));
  const subtotal = unitPrice * qty;
  const total = subtotal + (zone?.fee ?? 0);

  const pick = (position: number, value: string) => {
    setPicked((current) => current.map((v, i) => (i === position ? (v === value ? "" : value) : v)));
    setQuantity(1);
  };

  const pay = async () => {
    if (!choiceMade) return setError(`Choose ${options.map((o) => o.name.toLowerCase()).join(" and ")} first.`);
    if (stock <= 0) return setError("That's sold out.");
    if (!addressId) return setError("Add or choose your address first.");
    if (!zone) return setError("Choose delivery or pickup.");
    if (deliveryPhone && !PHONE_PATTERN.test(deliveryPhone)) return setError("Check the phone number for delivery.");

    const attempt = ++attemptRef.current;
    const isStale = () => attempt !== attemptRef.current;
    setError("");
    setProcessing(true);
    try {
      const { data } = await startPayment({
        code: live.code,
        data: { productId, variationId: match?.id, quantity: qty, addressId, shippingOptionId: zone.id, deliveryPhone, source: trafficSource() },
      });
      await payWithPaystack(data.accessCode, {
        onSuccess: async () => {
          try {
            const { data: order } = await verifyCheckout(data.reference);
            if (isStale()) return;
            if (order.status === "CANCELLED") setError("Sorry, it sold out just before your payment went through. We're refunding you.");
            else setPaidOrderId(order.id);
          } catch {
            if (!isStale()) setError("Payment was received but we couldn't confirm it yet. Check your orders page.");
          } finally {
            if (!isStale()) setProcessing(false);
          }
        },
        onCancel: () => !isStale() && setProcessing(false),
        onError: (message) => {
          if (isStale()) return;
          setError(message || "Payment failed. Please try again.");
          setProcessing(false);
        },
      });
    } catch {
      if (!isStale()) setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 sm:items-center" onClick={() => !processing && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Buy ${featured?.title ?? "product"}`}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-canvas p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">{paidOrderId ? "Order placed" : "Buy from this live"}</p>
          <button type="button" onClick={onClose} disabled={processing} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        {paidOrderId ? (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
            <div>
              <p className="text-[16px] font-semibold text-ink">Paid - thank you!</p>
              <p className="mt-1 text-[13px] text-muted">
                {live.store.name} has your order. Your delivery code is on the order page - only share it when you have your items.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button type="button" onClick={onClose} className="h-11 rounded-xl bg-violet-600 px-5 text-[13.5px] font-semibold text-white">
                Keep watching
              </button>
              <Link href={`/marketplace/orders/${paidOrderId}`} className="flex h-11 items-center justify-center rounded-xl border border-line px-5 text-[13.5px] font-semibold text-ink-2">
                View order
              </Link>
            </div>
          </div>
        ) : isLoading || !product ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-2xl border border-line bg-surface p-3">
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                {(featured?.image ?? product.images[0]?.url) && (
                  <Image src={(featured?.image ?? product.images[0]?.url) as string} alt="" fill sizes="80px" className="object-cover" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-semibold text-ink">{product.title}</span>
                <span className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className={`font-[family-name:var(--font-mono)] text-[16px] font-semibold ${discount ? "text-rose-600" : "text-violet-700 dark:text-violet-300"}`}>
                    {naira(unitPrice)}
                  </span>
                  {discount && (
                    <>
                      <span className="text-[12px] text-muted line-through">{naira(listPrice)}</span>
                      <span className="rounded bg-rose-100 px-1 text-[11px] font-bold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">Live -{discount}%</span>
                    </>
                  )}
                </span>
                {choiceMade && stock > 0 && stock <= 5 && <span className="text-[12px] font-semibold text-amber-600">Only {stock} left</span>}
                {choiceMade && stock <= 0 && <span className="text-[12px] font-semibold text-red-600">Sold out</span>}
              </span>
            </div>

            {hasOptions && <OptionPicker options={options} variations={variations} picked={picked} onPick={pick} />}

            {stock > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-semibold text-ink-2">Quantity</span>
                <div className="flex items-center gap-1 rounded-xl border border-line p-1">
                  <button type="button" aria-label="Fewer" onClick={() => setQuantity(Math.max(1, qty - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-2">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-[family-name:var(--font-mono)] text-[14px] font-semibold">{qty}</span>
                  <button type="button" aria-label="More" onClick={() => setQuantity(Math.min(stock, 20, qty + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-2">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            <ShippingAddress />

            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-ink">
                <Truck size={16} className="text-violet-600 dark:text-violet-400" /> Delivery
              </p>
              <ZonePicker
                storeName={live.store.name}
                storeAddress={live.storeAddress ?? ""}
                zones={live.shippingOptions}
                needed={product.deliveryVehicle ?? "BIKE"}
                selectedId={zone?.id}
                onSelect={setZone}
                onClear={clearZone}
              />
            </div>

            <dl className="space-y-1.5 rounded-2xl bg-surface-sunken p-4 text-[13.5px]">
              <div className="flex justify-between">
                <dt className="text-muted">{qty > 1 ? `${qty} × ${naira(unitPrice)}` : "Item"}</dt>
                <dd className="font-[family-name:var(--font-mono)] text-ink">{naira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="font-[family-name:var(--font-mono)] text-ink">{zone ? (zone.fee > 0 ? naira(zone.fee) : "Free") : "Choose above"}</dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-line pt-2 text-[15px] font-semibold">
                <dt className="text-ink">Total</dt>
                <dd className="font-[family-name:var(--font-mono)] text-violet-700 dark:text-violet-300">{naira(total)}</dd>
              </div>
            </dl>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            <button
              type="button"
              onClick={pay}
              disabled={processing}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/20 disabled:opacity-70"
            >
              {processing ? <Loader2 size={17} className="animate-spin" /> : <Lock size={16} />}
              {processing ? "Processing payment…" : `Pay ${naira(total)} securely`}
            </button>
            <p className="text-center text-[11.5px] text-subtle">
              Protected by Nestly: you get a delivery code, and returns are covered by our{" "}
              <Link href="/terms#returns" target="_blank" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
                returns policy
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
