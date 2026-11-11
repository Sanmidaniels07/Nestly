"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Gift as GiftIcon,
  KeyRound,
  Loader2,
  Lock,
  MapPin,
  PackageCheck,
  Share2,
  ShieldCheck,
  Store,
  Truck,
  XCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { useCancelGift, useClaimGift, useDeclineGift, useGift, giftKey } from "@/src/hooks/use-gifts";
import { useRequireLogin, useSession } from "@/src/hooks/use-session";
import { useAddresses } from "@/src/hooks/use-addresses";
import { useConfirmDelivery } from "@/src/hooks/use-confirm-delivery";
import { useAuthStore } from "@/src/store/auth-store";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { PHONE_PATTERN } from "@/src/lib/phone";
import Skeleton from "@/src/components/ui/skeleton";
import ShippingAddress from "@/src/app/(protected)/marketplace/checkout/components/shipping-address";
import { Gift } from "@/src/types/gift";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

const normalizeState = (value?: string | null) => (value ?? "").toLowerCase().replace(/\s+state$/, "").trim();

const daysLeft = (iso: string | null) => {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  return Math.max(0, days);
};

export default function GiftPage({ code }: { code: string }) {
  const userId = useAuthStore((state) => state.user?.id);
  const { isHydrated } = useSession();
  const { data: gift, isLoading, error } = useGift(code, userId);

  if (!isHydrated || (isLoading && !gift)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <Skeleton className="mx-auto h-72 w-72 rounded-[40px]" />
        <Skeleton className="mx-auto mt-6 h-8 w-64 rounded-xl" />
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <GiftIcon className="mx-auto h-10 w-10 text-violet-500" strokeWidth={1.5} />
        <p className="mt-4 text-[16px] font-semibold text-ink">
          {error?.response?.status === 404 ? "This gift link doesn't exist" : "We couldn't open this gift"}
        </p>
        <p className="mt-1.5 text-[13.5px] text-muted">Check the link, or ask whoever sent it to share it again.</p>
        <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Browse Nestly
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-24 pt-6 sm:pt-10">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-96 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.35),transparent_65%)]" />
      <div className="mb-6 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-emerald-700 dark:text-emerald-300">
        <Lock size={14} /> Secure gift · Nestly
      </div>
      {gift.role === "SENDER" ? <SenderView gift={gift} /> : <RecipientView gift={gift} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sender

function SenderView({ gift }: { gift: Gift }) {
  const justSent = useSearchParams().get("sent") === "1";
  const { mutate: cancel, isPending: cancelling } = useCancelGift();
  const [confirmCancel, setConfirmCancel] = useState(false);
  // Someone on Nestly: first name. A link gift keeps what the sender typed ("my friend").
  const name = gift.hasNamedRecipient ? firstName(gift.recipientName) : gift.recipientName;
  const left = daysLeft(gift.expiresAt);

  return (
    <div className="space-y-5">
      <div className="text-center">
        {justSent && gift.status === "SENT" && <Confetti />}
        <motion.div
          initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-xl shadow-violet-500/30"
        >
          <GiftIcon size={36} />
        </motion.div>
        <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-[32px] leading-tight text-ink sm:text-[38px]">
          {gift.status === "SENT"
            ? justSent
              ? "Gift sent! 🎉"
              : `Waiting for ${name}`
            : gift.status === "CLAIMED"
              ? `${name} accepted your gift 🎉`
              : gift.status === "UNPAID"
                ? "Payment not finished"
                : "This gift has ended"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-muted">
          {gift.status === "SENT" &&
            (gift.hasNamedRecipient
              ? `We've told ${name} on Nestly. You can also send them the link - they add their own delivery address.`
              : `Send ${name} this link. They open it, see their gift and add their own delivery address.`)}
          {gift.status === "CLAIMED" && "They've added their delivery details and the seller is preparing it."}
          {gift.status === "UNPAID" && "Your payment didn't go through, so nothing was sent. You haven't been charged."}
          {(gift.status === "DECLINED" || gift.status === "EXPIRED" || gift.status === "CANCELLED") && <ClosedReason gift={gift} />}
        </p>
      </div>

      {gift.status === "SENT" && <SharePanel gift={gift} />}

      <GiftCard gift={gift} />

      {gift.status === "CLAIMED" && gift.senderProgress && (
        <Progress status={gift.senderProgress.itemStatus} accepted />
      )}

      {gift.payment && (
        <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-5 py-3.5 text-[13.5px]">
          <span className="text-muted">You paid</span>
          <span className="font-[family-name:var(--font-mono)] font-semibold text-ink">{naira(gift.payment.total)}</span>
        </div>
      )}

      {gift.status === "SENT" && (
        <div className="rounded-2xl border border-line bg-surface p-4 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[12.5px] text-muted">
            <Clock size={14} /> {left === 0 ? "Expires today" : `${left} day${left === 1 ? "" : "s"} left to accept`} - if not, you&apos;re refunded in full.
          </p>
          {confirmCancel ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[13px] text-ink">Cancel and get a refund?</span>
              <button
                type="button"
                disabled={cancelling}
                onClick={() => cancel(gift.code)}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-60"
              >
                {cancelling && <Loader2 size={13} className="animate-spin" />} Yes, cancel
              </button>
              <button type="button" onClick={() => setConfirmCancel(false)} className="rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-muted hover:text-ink">
                Keep it
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmCancel(true)} className="mt-2 text-[12.5px] font-semibold text-red-600 hover:underline dark:text-red-400">
              Cancel gift
            </button>
          )}
        </div>
      )}

      <p className="text-center text-[12.5px]">
        <Link href="/marketplace/gifts" className="font-semibold text-violet-700 hover:underline dark:text-violet-300">
          All your gifts
        </Link>
      </p>
    </div>
  );
}

function ClosedReason({ gift }: { gift: Gift }) {
  // Someone on Nestly: first name. A link gift keeps what the sender typed ("my friend").
  const name = gift.hasNamedRecipient ? firstName(gift.recipientName) : gift.recipientName;
  const refund =
    gift.payment?.refundStatus === "FAILED"
      ? " Our team will refund you shortly."
      : " We've refunded your payment - it can take a few days to show.";
  if (gift.status === "DECLINED") return <>{`${name} declined the gift.${refund}`}</>;
  if (gift.status === "EXPIRED") return <>{`${name} didn't accept it within 7 days.${refund}`}</>;
  return <>{`The gift was cancelled.${refund}`}</>;
}

function SharePanel({ gift }: { gift: Gift }) {
  const [copied, setCopied] = useState(false);
  // Rendered in the browser only (the page waits for the session first).
  const url = typeof window === "undefined" ? "" : `${window.location.origin}/gift/${gift.code}`;

  const text = `🎁 I sent you a gift on Nestly! Open it to see what it is and tell me where to deliver it: ${url}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const share = () => navigator.share?.({ title: "A gift for you", text, url }).catch(() => undefined);

  return (
    <div className="rounded-3xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-500/30 dark:bg-violet-500/10">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">Gift link</p>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono)] text-[12.5px] text-ink">{url || `…/gift/${gift.code}`}</span>
        <button type="button" onClick={copy} className="flex shrink-0 items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1.5 text-[12px] font-semibold text-white">
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-[13px] font-semibold text-white hover:brightness-105"
        >
          <FaWhatsapp size={16} /> WhatsApp
        </a>
        <button type="button" onClick={share} className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface py-2.5 text-[13px] font-semibold text-ink-2 hover:border-violet-300">
          <Share2 size={15} /> More
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recipient (or anyone holding the link)

function RecipientView({ gift }: { gift: Gift }) {
  const reduce = useReducedMotion();
  // Already accepted (or ended): no need to unwrap it again.
  const [opened, setOpened] = useState(gift.status !== "SENT" || !!reduce);
  const sender = firstName(gift.sender.name);

  if (gift.status === "CLAIMED") {
    return gift.role === "RECIPIENT" ? (
      <ClaimedView gift={gift} />
    ) : (
      <Ended title="This gift has been accepted" text={`It's on its way to the person ${sender} sent it to.`} />
    );
  }
  if (gift.status !== "SENT") {
    return (
      <Ended
        title={gift.status === "DECLINED" ? "This gift was declined" : gift.status === "EXPIRED" ? "This gift has expired" : "This gift was cancelled"}
        text={`It can't be accepted any more. ${sender} has been refunded.`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">For {gift.recipientName}</p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[32px] leading-tight text-ink sm:text-[40px]">
          {gift.sender.name} sent {gift.forSomeoneElse ? "a gift" : "you a gift"}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div key="box" exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center">
            <GiftBox onOpen={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.div key="inside" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {!reduce && <Confetti />}
            <GiftCard gift={gift} />
            {gift.forSomeoneElse ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-[13.5px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                This gift is for {gift.recipientName}. If that&apos;s you, sign in with the account {sender} chose.
              </div>
            ) : (
              <AcceptPanel gift={gift} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GiftBox({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const open = () => {
    setOpening(true);
    setTimeout(onOpen, 700);
  };

  return (
    <button type="button" onClick={open} aria-label="Open your gift" className="group relative mt-4 h-64 w-64 select-none">
      {/* glow */}
      <motion.span
        className="absolute inset-0 rounded-[48px] bg-violet-400/40 blur-3xl"
        animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <motion.span
        className="absolute inset-x-6 bottom-4 top-20 rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 shadow-2xl shadow-violet-500/40"
        animate={opening ? { scale: 1.05 } : { rotate: [0, -2, 2, -1, 0] }}
        transition={opening ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
      >
        <span className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-amber-300/90" />
      </motion.span>
      {/* lid */}
      <motion.span
        className="absolute inset-x-3 top-14 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg"
        animate={opening ? { y: -120, rotate: -24, opacity: 0 } : { y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-amber-300" />
        <span className="absolute -top-7 left-1/2 flex -translate-x-1/2 gap-0.5">
          <span className="h-9 w-9 rotate-[-30deg] rounded-full border-[7px] border-amber-300" />
          <span className="h-9 w-9 rotate-[30deg] rounded-full border-[7px] border-amber-300" />
        </span>
      </motion.span>
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-5 py-2 text-[13.5px] font-semibold text-surface shadow-lg transition-transform group-hover:scale-105">
        Tap to open
      </span>
    </button>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        x: Math.cos((i / 28) * Math.PI * 2) * (120 + (i % 4) * 40),
        y: Math.sin((i / 28) * Math.PI * 2) * (90 + (i % 3) * 40) - 60,
        color: ["#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"][i % 5],
        rotate: (i * 47) % 360,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none relative mx-auto h-0 w-0">
      {pieces.map((piece, i) => (
        <motion.span
          key={i}
          className="absolute h-2.5 w-1.5 rounded-sm"
          style={{ backgroundColor: piece.color }}
          initial={{ x: 0, y: 40, opacity: 1, rotate: 0 }}
          animate={{ x: piece.x, y: piece.y + 160, opacity: 0, rotate: piece.rotate + 360 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function GiftCard({ gift }: { gift: Gift }) {
  if (!gift.item) return null;
  const delivery = gift.delivery;
  const where =
    delivery?.type === "PICKUP"
      ? `Pickup${delivery.pickupAddress ? ` at ${delivery.pickupAddress}` : ""}`
      : delivery
        ? `Delivery in ${delivery.areas.length ? delivery.areas.slice(0, 4).join(", ") + (delivery.areas.length > 4 ? "…" : "") : ""}${
            delivery.state ? `${delivery.areas.length ? ", " : ""}${delivery.state}` : delivery.areas.length ? "" : "their area"
          }`
        : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_24px_60px_-28px_rgba(124,58,237,0.35)]">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-amber-50 dark:from-violet-500/20 dark:via-fuchsia-500/10 dark:to-amber-500/5">
        {gift.item.image && <Image src={gift.item.image} alt={gift.item.title ?? "Gift"} fill sizes="640px" className="object-cover" priority />}
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <p className="font-[family-name:var(--font-fraunces)] text-[24px] leading-tight text-ink">{gift.item.title}</p>
          <p className="mt-1 text-[13px] text-muted">
            {[gift.item.variantLabel, gift.item.quantity > 1 ? `× ${gift.item.quantity}` : null].filter(Boolean).join(" · ")}
          </p>
          {gift.item.unitPrice !== null && (
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[15px] font-semibold text-violet-700 dark:text-violet-300">
              {naira(gift.item.unitPrice * gift.item.quantity)}
            </p>
          )}
        </div>
        {gift.message && (
          <blockquote className="rounded-2xl bg-violet-50 px-4 py-3 text-[14.5px] italic leading-relaxed text-ink-2 dark:bg-violet-500/10">
            “{gift.message}”
            <span className="mt-1 block text-right text-[12.5px] not-italic text-muted">- {gift.sender.name}</span>
          </blockquote>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-muted">
          {gift.store && (
            <Link href={`/marketplace/seller/${gift.store.slug}`} className="flex items-center gap-1.5 hover:text-violet-700 dark:hover:text-violet-300">
              <Store size={13} /> {gift.store.name}
            </Link>
          )}
          {where && (
            <span className="flex items-center gap-1.5">
              {delivery?.type === "PICKUP" ? <Store size={13} /> : <Truck size={13} />} {where}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AcceptPanel({ gift }: { gift: Gift }) {
  const { isLoggedIn } = useSession();
  const requireLogin = useRequireLogin();

  if (!isLoggedIn) {
    return (
      <div className="space-y-3 rounded-3xl border border-line bg-surface p-5 text-center">
        <p className="text-[14.5px] font-semibold text-ink">Sign in to accept your gift</p>
        <p className="text-[13px] text-muted">A free Nestly account takes a minute. It&apos;s how you add your address and follow your delivery.</p>
        <button
          type="button"
          onClick={() => requireLogin("Log in or create a free account to accept your gift.")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/25"
        >
          <GiftIcon size={17} /> Accept my gift
        </button>
      </div>
    );
  }

  return <AcceptForm gift={gift} />;
}

// Signed in: where it should go, then accept.
function AcceptForm({ gift }: { gift: Gift }) {
  const addressId = useCheckoutStore((state) => state.addressId);
  const deliveryPhone = useCheckoutStore((state) => state.deliveryPhone?.trim() || "");
  const { data: addresses } = useAddresses();
  const { mutate: claim, isPending } = useClaimGift();
  const { mutate: decline, isPending: declining } = useDeclineGift();
  const [pickupPhone, setPickupPhone] = useState("");
  const [error, setError] = useState("");
  const [confirmDecline, setConfirmDecline] = useState(false);
  const isPickup = gift.delivery?.type === "PICKUP";
  const sender = firstName(gift.sender.name);

  const address = addresses?.find((a) => a.id === addressId);
  const wrongState =
    !isPickup && !!address && !!gift.delivery?.state && normalizeState(address.state) !== normalizeState(gift.delivery.state);

  const accept = () => {
    setError("");
    if (isPickup) {
      if (pickupPhone && !PHONE_PATTERN.test(pickupPhone)) return setError("Check your phone number.");
      return claim({ code: gift.code, data: { deliveryPhone: pickupPhone.trim() || undefined } });
    }
    if (!addressId) return setError("Add or choose the address where you'd like it delivered.");
    if (wrongState) return setError(`${sender} paid for delivery in ${gift.delivery?.state}. Choose an address there.`);
    if (deliveryPhone && !PHONE_PATTERN.test(deliveryPhone)) return setError("Check the phone number for delivery.");
    claim({ code: gift.code, data: { addressId, deliveryPhone: deliveryPhone || undefined } });
  };

  return (
    <div className="space-y-4">
      {isPickup ? (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
            <Store size={16} className="text-violet-600" /> You&apos;ll pick it up
          </p>
          {gift.delivery?.pickupAddress && <p className="mt-1 text-[13px] text-muted">From {gift.delivery.pickupAddress}</p>}
          <label htmlFor="pickup-phone" className="mt-4 block text-[12.5px] font-semibold text-ink-2">
            Your phone number (so the seller can reach you)
          </label>
          <input
            id="pickup-phone"
            value={pickupPhone}
            onChange={(e) => setPickupPhone(e.target.value)}
            placeholder="0803 123 4567"
            inputMode="tel"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 sm:text-[14px]"
          />
        </div>
      ) : (
        <>
          {gift.delivery?.state && (
            <p className="flex items-center gap-2 rounded-xl bg-surface-2 px-4 py-2.5 text-[12.5px] text-ink-2">
              <MapPin size={14} className="shrink-0 text-violet-600" /> {sender} paid for delivery in{" "}
              <strong>{gift.delivery.areas.length ? `${gift.delivery.areas.slice(0, 3).join(", ")}, ${gift.delivery.state}` : gift.delivery.state}</strong>
            </p>
          )}
          <ShippingAddress />
          {wrongState && (
            <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[12.5px] text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> This address is outside {gift.delivery?.state}. Add an address in {gift.delivery?.state}, or ask {sender} to
              send it to your area.
            </p>
          )}
        </>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <button
        type="button"
        onClick={accept}
        disabled={isPending}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:brightness-110 disabled:opacity-70"
      >
        {isPending ? <Loader2 size={17} className="animate-spin" /> : <GiftIcon size={17} />} Accept my gift
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-[12px] text-muted">
        <ShieldCheck size={13} className="text-emerald-600" /> Free for you - {sender} has paid for it and the delivery.
      </p>

      {gift.role === "RECIPIENT" && gift.hasNamedRecipient && (
        <div className="text-center">
          {confirmDecline ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[12.5px] text-ink">Decline it? {sender} gets a refund.</span>
              <button
                type="button"
                disabled={declining}
                onClick={() => decline(gift.code)}
                className="flex items-center gap-1 rounded-lg bg-surface-2 px-3 py-1.5 text-[12px] font-semibold text-ink"
              >
                {declining && <Loader2 size={12} className="animate-spin" />} Yes, decline
              </button>
              <button type="button" onClick={() => setConfirmDecline(false)} className="text-[12px] font-semibold text-muted">
                Keep it
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDecline(true)} className="text-[12px] text-subtle hover:text-ink hover:underline">
              No thanks, decline
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ClaimedView({ gift }: { gift: Gift }) {
  const queryClient = useQueryClient();
  const progress = gift.progress;
  const { mutate: confirm, isPending } = useConfirmDelivery("");
  const delivered = progress?.itemStatus === "DELIVERED";

  return (
    <div className="space-y-5">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
        >
          <PackageCheck size={30} />
        </motion.div>
        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-[30px] leading-tight text-ink sm:text-[36px]">
          {delivered ? "Your gift has arrived 🎉" : "Your gift is on its way"}
        </h1>
        <p className="mt-1.5 text-[13.5px] text-muted">From {gift.sender.name}</p>
      </div>

      {progress && <Progress status={progress.itemStatus} accepted />}

      {progress?.deliveryCode && !progress.deliveryConfirmedAt && (
        <div className="rounded-3xl border border-violet-200 bg-violet-50/70 p-5 text-center dark:border-violet-500/30 dark:bg-violet-500/10">
          <p className="flex items-center justify-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
            <KeyRound size={14} /> Your delivery code
          </p>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-[34px] font-bold tracking-[0.3em] text-violet-700 dark:text-violet-300">
            {progress.deliveryCode}
          </p>
          <p className="mt-1 text-[12.5px] text-muted">Give it to the seller only once you have your gift - it confirms it arrived.</p>
        </div>
      )}

      {delivered && progress && !progress.deliveryConfirmedAt && (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            confirm(progress.orderItemId, { onSuccess: () => queryClient.invalidateQueries({ queryKey: giftKey(gift.code) }) })
          }
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-[14px] font-semibold text-white disabled:opacity-60"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} I&apos;ve received it
        </button>
      )}

      <GiftCard gift={gift} />

      {progress?.deliverTo && (
        <div className="rounded-2xl border border-line bg-surface p-4 text-[13px]">
          <p className="font-semibold text-ink">Delivering to</p>
          <p className="mt-1 text-muted">
            {progress.deliverTo.fullName}, {progress.deliverTo.address}, {progress.deliverTo.city}, {progress.deliverTo.state}
            {progress.deliveryPhone ? ` · ${progress.deliveryPhone}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

function Progress({ status, accepted }: { status: string; accepted: boolean }) {
  const steps = [
    { label: "Accepted", done: accepted },
    { label: "On its way", done: status === "SHIPPED" || status === "DELIVERED" },
    { label: "Delivered", done: status === "DELIVERED" },
  ];
  return (
    <div className="flex items-center rounded-2xl border border-line bg-surface px-4 py-4">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-1 flex-col items-center">
          <div className="flex w-full items-center">
            <div className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : step.done ? "bg-emerald-500" : "bg-line-strong"}`} />
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                step.done ? "bg-emerald-500 text-white" : "bg-line-strong text-subtle"
              }`}
            >
              {step.done ? <Check size={14} strokeWidth={3} /> : i === 1 ? <Truck size={13} /> : <PackageCheck size={13} />}
            </span>
            <div className={`h-0.5 flex-1 ${i === steps.length - 1 ? "opacity-0" : steps[i + 1].done ? "bg-emerald-500" : "bg-line-strong"}`} />
          </div>
          <span className={`mt-2 text-[11.5px] font-medium ${step.done ? "text-ink-2" : "text-subtle"}`}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

function Ended({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-line bg-surface px-6 py-14 text-center">
      <XCircle className="mx-auto h-9 w-9 text-subtle" strokeWidth={1.5} />
      <p className="mt-3 text-[16px] font-semibold text-ink">{title}</p>
      <p className="mt-1 text-[13.5px] text-muted">{text}</p>
      <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
        Browse Nestly
      </Link>
    </div>
  );
}
