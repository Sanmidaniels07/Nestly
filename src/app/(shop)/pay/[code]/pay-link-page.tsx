"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Store,
  Truck,
  Wallet,
} from "lucide-react";

import { usePaymentLink, usePayPaymentLink } from "@/src/hooks/use-payment-links";
import { useVerifyCheckout } from "@/src/hooks/use-verify-checkout";
import { useCreateConversation } from "@/src/hooks/use-create-conversation";
import { useRequireLogin, useSession } from "@/src/hooks/use-session";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { payWithPaystack } from "@/src/lib/paystack";
import { afterPaymentPath } from "@/src/lib/order-result";
import { trafficSource } from "@/src/lib/traffic-source";
import { PHONE_PATTERN } from "@/src/lib/phone";
import { naira } from "@/src/lib/payment-link";
import Skeleton from "@/src/components/ui/skeleton";
import ShippingAddress from "@/src/app/(protected)/marketplace/checkout/components/shipping-address";
import ZonePicker, { ZoneOption } from "@/src/app/(protected)/marketplace/checkout/components/zone-picker";
import { ApiResponse } from "@/src/types/api";
import { PublicPaymentLink } from "@/src/types/payment-link";

interface Props {
  code: string;
  initialLink?: ApiResponse<PublicPaymentLink>;
}

const NOTE_MAX = 500;

export default function PayLinkPage({ code, initialLink }: Props) {
  const { data: link, isLoading, isError } = usePaymentLink(code, initialLink);

  if (isLoading && !link) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !link) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">This payment link doesn&apos;t work any more</p>
        <p className="mt-1.5 text-[13.5px] text-muted">The seller may have deleted it. Ask them for a new link.</p>
        <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Browse Nestly
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:pt-8">
      <div className="mb-5 flex items-center gap-2 text-[12.5px] font-semibold text-emerald-700 dark:text-emerald-300">
        <Lock size={14} /> Secure payment link · Nestly
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <ItemDetails link={link} />
          <Protection />
        </div>
        <div className="min-w-0 lg:sticky lg:top-24">
          <PayPanel link={link} />
        </div>
      </div>
    </div>
  );
}

function ItemDetails({ link }: { link: PublicPaymentLink }) {
  const images = [...link.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const [active, setActive] = useState(0);
  const location = [...new Set([link.store.city, link.store.state].filter(Boolean))].join(", ");

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      {images.length > 0 && (
        <div>
          <div className="relative aspect-[4/3] bg-surface-sunken">
            <Image src={images[active]?.url ?? images[0].url} alt={link.title} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" priority />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((image, index) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Photo ${index + 1}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${index === active ? "border-violet-500" : "border-transparent"}`}
                >
                  <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic leading-tight text-ink sm:text-[30px]">{link.title}</h1>
          <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[22px] font-semibold text-violet-700 dark:text-violet-300">{naira(link.price)}</p>
        </div>

        {link.description && <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink-2">{link.description}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-sunken p-3.5">
          <Link href={`/marketplace/seller/${link.store.slug}`} className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              {link.store.logo ? <Image src={link.store.logo} alt="" fill sizes="44px" className="object-cover" /> : <Store size={18} />}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-[14px] font-semibold text-ink">
                <span className="truncate">{link.store.name}</span>
                {link.store.isVerified && <BadgeCheck size={15} className="shrink-0 text-violet-600" aria-label="Verified business" />}
              </span>
              {location && (
                <span className="flex items-center gap-1 text-[12px] text-muted">
                  <MapPin size={12} /> {location}
                </span>
              )}
            </span>
          </Link>
          {!link.isOwner && <MessageSeller sellerUserId={link.store.sellerUserId} />}
        </div>
      </div>
    </section>
  );
}

function MessageSeller({ sellerUserId }: { sellerUserId: string }) {
  const router = useRouter();
  const requireLogin = useRequireLogin();
  const { mutate: createConversation, isPending } = useCreateConversation();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!requireLogin("Log in to message the seller.")) return;
        createConversation(sellerUserId, { onSuccess: (response) => router.push(`/messages/${response.data.id}`) });
      }}
      className="flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-2 hover:border-violet-300 disabled:opacity-60 dark:hover:border-violet-500/40"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />} Message seller
    </button>
  );
}

// Why paying here is safe - the whole point of the link.
function Protection() {
  const steps = [
    { icon: Wallet, title: "You pay Nestly, not the seller", text: "Your money is held safely by Nestly through Paystack." },
    { icon: Truck, title: "The seller delivers", text: "You get a delivery code. Only give it to the seller when you have your order." },
    { icon: PackageCheck, title: "Then the seller is paid", text: "Something wrong? Report it - you're covered by Nestly's returns and refunds policy." },
  ];
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/5 sm:p-6">
      <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
        <ShieldCheck size={18} className="text-emerald-600" /> Your money is protected
      </h2>
      <ol className="mt-4 space-y-3.5">
        {steps.map((step) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-emerald-600">
              <step.icon size={16} />
            </span>
            <span>
              <span className="block text-[13.5px] font-semibold text-ink">{step.title}</span>
              <span className="block text-[12.5px] leading-relaxed text-muted">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[12px] text-muted">
        Never pay a seller directly by bank transfer for a Nestly order.{" "}
        <Link href="/terms#returns" target="_blank" className="font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Returns &amp; refunds
        </Link>
      </p>
    </section>
  );
}

function PayPanel({ link }: { link: PublicPaymentLink }) {
  const router = useRouter();
  const { isLoggedIn, isHydrated } = useSession();
  const requireLogin = useRequireLogin();
  const addressId = useCheckoutStore((state) => state.addressId);
  const deliveryPhone = useCheckoutStore((state) => state.deliveryPhone?.trim() || undefined);
  const { mutateAsync: startPayment } = usePayPaymentLink();
  const { mutateAsync: verifyCheckout } = useVerifyCheckout();

  const [quantity, setQuantity] = useState(1);
  const [zone, setZone] = useState<ZoneOption | null>(null);
  const clearZone = useCallback(() => setZone(null), []);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const attemptRef = useRef(0);

  const isPickup = link.deliveryType === "PICKUP";
  const buyerChooses = link.deliveryType === "STORE_OPTIONS";
  const max = Math.max(1, link.quantityAvailable);
  const qty = Math.min(quantity, max);
  const subtotal = link.price * qty;
  // Unknown until the buyer picks a zone (buyerChooses).
  const deliveryFee: number | null = buyerChooses ? zone?.fee ?? null : isPickup ? 0 : link.deliveryFee;
  const total = subtotal + (deliveryFee ?? 0);
  const cheapest = buyerChooses && link.shippingOptions.length ? Math.min(...link.shippingOptions.map((o) => o.fee)) : 0;

  if (link.isOwner) {
    return (
      <aside className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/60 p-5 dark:border-violet-500/30 dark:bg-violet-500/5">
        <p className="text-[14.5px] font-semibold text-ink">This is your payment link</p>
        <p className="text-[13px] leading-relaxed text-muted">
          This is what your buyer sees. Send them the link in your DMs or WhatsApp - you&apos;ll be told as soon as they pay.
        </p>
        <Link href="/settings/marketplace?tab=links" className="inline-block text-[13px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Manage your links
        </Link>
      </aside>
    );
  }

  if (link.availability !== "AVAILABLE") {
    return (
      <aside className="rounded-2xl border border-line bg-surface p-5 text-center">
        <p className="text-[15px] font-semibold text-ink">{link.availability === "SOLD_OUT" ? "Sold out" : "Not available right now"}</p>
        <p className="mt-1 text-[13px] text-muted">
          {link.availability === "SOLD_OUT"
            ? "This item has been bought. Message the seller if you'd like another."
            : "The seller has paused this link. Message them to turn it back on."}
        </p>
      </aside>
    );
  }

  const pay = async () => {
    if (!requireLogin("Log in or create a free account to pay safely.")) return;
    if (!addressId) return setError("Add or choose your address first.");
    if (buyerChooses && !zone) return setError("Choose how you'd like to receive it.");
    if (deliveryPhone && !PHONE_PATTERN.test(deliveryPhone)) return setError("Check the phone number for delivery.");

    const attempt = ++attemptRef.current;
    const isStale = () => attempt !== attemptRef.current;
    setError("");
    setProcessing(true);

    try {
      const { data } = await startPayment({
        code: link.code,
        data: { quantity: qty, addressId, shippingOptionId: zone?.id, deliveryPhone, note: note.trim() || undefined, source: trafficSource() },
      });
      await payWithPaystack(data.accessCode, {
        onSuccess: async () => {
          try {
            const { data: order } = await verifyCheckout(data.reference);
            if (!isStale()) router.push(afterPaymentPath(order));
          } catch {
            if (!isStale()) {
              setError("Payment was received but we couldn't confirm it yet. Check your orders page.");
              setProcessing(false);
            }
          }
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
    } catch {
      if (!isStale()) setProcessing(false);
    }
  };

  return (
    <aside className="space-y-5">
      <div className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        {link.quantityAvailable > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-semibold text-ink-2">Quantity</span>
            <div className="flex items-center gap-1 rounded-xl border border-line p-1">
              <button type="button" aria-label="Fewer" onClick={() => setQuantity(Math.max(1, qty - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-2">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-[family-name:var(--font-mono)] text-[14px] font-semibold">{qty}</span>
              <button type="button" aria-label="More" onClick={() => setQuantity(Math.min(max, qty + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-2">
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2.5 rounded-xl bg-surface-sunken p-3.5 text-[12.5px] text-ink-2">
          {isPickup ? <Store size={16} className="mt-0.5 shrink-0 text-violet-600" /> : <Truck size={16} className="mt-0.5 shrink-0 text-violet-600" />}
          <span>
            {buyerChooses ? (
              zone ? (
                <>
                  <span className="font-semibold">{zone.type === "PICKUP" ? "You'll pick it up" : zone.name}</span>
                  {zone.type === "PICKUP" ? " - free." : ` - ${zone.fee > 0 ? naira(zone.fee) : "free"} delivery.`}
                </>
              ) : (
                <>
                  <span className="font-semibold">Choose delivery to your area or pickup</span>
                  {cheapest > 0 ? ` - delivery from ${naira(cheapest)}.` : "."}
                </>
              )
            ) : isPickup ? (
              <>
                <span className="font-semibold">Pickup</span>
                {link.pickupAddress ? ` from ${link.pickupAddress}` : ""}. The seller will tell you when it&apos;s ready.
              </>
            ) : (
              <>
                <span className="font-semibold">The seller delivers to you</span>
                {link.deliveryFee > 0 ? ` for ${naira(link.deliveryFee)}` : " for free"}, as agreed.
              </>
            )}
          </span>
        </div>

        <dl className="space-y-2 text-[13.5px]">
          <div className="flex justify-between">
            <dt className="text-muted">{qty > 1 ? `${qty} × ${naira(link.price)}` : "Item"}</dt>
            <dd className="font-[family-name:var(--font-mono)] text-ink">{naira(subtotal)}</dd>
          </div>
          {!isPickup && (
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-[family-name:var(--font-mono)] text-ink">
                {deliveryFee === null ? "Choose below" : deliveryFee > 0 ? naira(deliveryFee) : "Free"}
              </dd>
            </div>
          )}
          <div className="flex justify-between border-t border-dashed border-line pt-2.5 text-[15px] font-semibold">
            <dt className="text-ink">Total</dt>
            <dd className="font-[family-name:var(--font-mono)] text-violet-700 dark:text-violet-300">{naira(total)}</dd>
          </div>
        </dl>
      </div>

      {isLoggedIn && (
        <>
          <ShippingAddress />
          {buyerChooses && (
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink">
                <Truck size={16} className="text-violet-600 dark:text-violet-400" /> Delivery
              </p>
              <ZonePicker
                storeName={link.store.name}
                storeAddress={[link.store.address, link.store.city, link.store.state].filter(Boolean).join(", ")}
                zones={link.shippingOptions}
                needed={link.deliveryVehicle}
                selectedId={zone?.id}
                onSelect={setZone}
                onClear={clearZone}
              />
            </div>
          )}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <label htmlFor="seller-note" className="text-[13.5px] font-semibold text-ink">
              Note for the seller (optional)
            </label>
            <textarea
              id="seller-note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
              rows={3}
              placeholder="e.g. write “Happy birthday Tolu” on it"
              className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
            />
          </div>
        </>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={pay}
        disabled={processing || !isHydrated}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 disabled:opacity-70"
      >
        {processing ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Processing payment…
          </>
        ) : isLoggedIn ? (
          <>
            <Lock size={16} /> Pay {naira(total)} securely
          </>
        ) : (
          "Log in or sign up to pay"
        )}
      </button>
      <p className="text-center text-[12px] leading-relaxed text-subtle">
        {isLoggedIn ? (
          <>
            By paying, you agree to Nestly&apos;s{" "}
            <Link href="/terms" target="_blank" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
              Terms of Service
            </Link>
            .
          </>
        ) : (
          "Free account, takes a minute. It's how you track your order and get your delivery code."
        )}
      </p>
    </aside>
  );
}
