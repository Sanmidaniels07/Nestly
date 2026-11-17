"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, HandCoins, Loader2, Lock, Undo2, XCircle } from "lucide-react";

import { useRespondOffer, useWithdrawOffer } from "@/src/hooks/use-offers";
import { useCategories } from "@/src/hooks/use-categories";
import { naira } from "@/src/lib/payment-link";
import { formatTimeOfDay } from "@/src/lib/date";
import { OfferCard as Offer } from "@/src/types/conversation";

// An offer in a chat. Shows the live state for whoever is looking:
// - the side that didn't make it can accept, counter or decline;
// - the side that did can take it back while it's waiting;
// - accepted: the buyer gets "Pay securely", the seller waits; then "Paid".

const STATUS: Record<string, { label: string; tone: string; icon: typeof Clock }> = {
  PENDING: { label: "Waiting for a reply", tone: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200", icon: Clock },
  ACCEPTED: { label: "Accepted", tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200", icon: CheckCircle2 },
  PAID: { label: "Paid", tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200", icon: Lock },
  COUNTERED: { label: "Countered", tone: "bg-surface-2 text-muted", icon: HandCoins },
  DECLINED: { label: "Declined", tone: "bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200", icon: XCircle },
  WITHDRAWN: { label: "Withdrawn", tone: "bg-surface-2 text-muted", icon: Undo2 },
  EXPIRED: { label: "Expired", tone: "bg-surface-2 text-muted", icon: Clock },
};

const parseAmount = (value: string) => (value.trim() ? Number(value.replace(/[,\s₦]/g, "")) : NaN);

export default function OfferCard({
  offer,
  conversationId,
  currentUserId,
  createdAt,
}: {
  offer: Offer;
  conversationId: string;
  currentUserId?: string;
  createdAt: string;
}) {
  const [now] = useState(() => Date.now());
  const expired = offer.status === "PENDING" && new Date(offer.expiresAt).getTime() <= now;
  const paid = !!offer.paymentLink && offer.paymentLink._count.orders > 0;
  const state = paid ? "PAID" : expired ? "EXPIRED" : offer.status;

  const isSeller = currentUserId === offer.store.seller.userId;
  const isBuyer = currentUserId === offer.buyerId;
  const madeByMe = currentUserId === offer.createdById;
  const canAnswer = state === "PENDING" && !madeByMe && (isSeller || isBuyer);
  const madeBySeller = offer.createdById === offer.store.seller.userId;
  const total = offer.price * offer.quantity + (offer.deliveryFee ?? 0);
  const cover = offer.product?.images[0]?.url;
  const status = STATUS[state];

  return (
    <div className="w-[min(320px,80vw)] overflow-hidden rounded-2xl border border-line bg-surface text-left text-ink shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-surface-sunken px-3.5 py-2">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-violet-700 dark:text-violet-300">
          <HandCoins size={14} /> {offer.counterOfId ? (madeBySeller ? "Seller's counter-offer" : "Counter-offer") : "Offer"}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.tone}`}>
          <status.icon size={11} /> {status.label}
        </span>
      </div>

      <div className="flex gap-3 p-3.5">
        {cover && (
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
            <Image src={cover} alt="" fill sizes="56px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[13.5px] font-semibold">{offer.title}</p>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700 dark:text-violet-300">
            {naira(offer.price)}
            {offer.quantity > 1 && <span className="text-[12.5px] font-normal text-muted"> each × {offer.quantity}</span>}
          </p>
          {offer.product && offer.product.price !== offer.price && (
            <p className="text-[11.5px] text-subtle">
              Listed at <span className="line-through">{naira(offer.product.price)}</span>
            </p>
          )}
          {offer.note && <p className="mt-1.5 text-[12.5px] text-ink-2">&ldquo;{offer.note}&rdquo;</p>}
        </div>
      </div>

      <div className="space-y-2 border-t border-line px-3.5 py-3">
        {canAnswer && <AnswerForm offer={offer} conversationId={conversationId} isSeller={isSeller} />}

        {state === "PENDING" && madeByMe && <WaitingRow offer={offer} conversationId={conversationId} />}

        {state === "ACCEPTED" && isBuyer && offer.paymentLink && (
          <Link
            href={`/pay/${offer.paymentLink.code}`}
            className="whitespace-nowrap flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13px] font-semibold text-white hover:brightness-110"
          >
            <Lock size={14} /> Pay {offer.store._count.shippingOptions > 0 ? naira(offer.price * offer.quantity) + " + delivery" : naira(total)} securely
          </Link>
        )}
        {state === "ACCEPTED" && isSeller && (
          <p className="text-[12px] text-muted">Waiting for the buyer to pay. You&apos;ll be told as soon as they do.</p>
        )}
        {state === "PAID" && (
          <p className="text-[12px] text-muted">
            {isSeller ? "Paid - it's in your orders. Deliver it and take the buyer's code." : "Paid. Your money is held until you receive it."}
          </p>
        )}
        {state === "EXPIRED" && <p className="text-[12px] text-muted">This offer lapsed after 48 hours. Make a new one to keep going.</p>}

        <p className="text-right text-[10.5px] text-subtle">{formatTimeOfDay(createdAt)}</p>
      </div>
    </div>
  );
}

function WaitingRow({ offer, conversationId }: { offer: Offer; conversationId: string }) {
  const { mutate: withdraw, isPending } = useWithdrawOffer(conversationId);
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-[12px] text-muted">Waiting for the {offer.createdById === offer.buyerId ? "seller" : "buyer"} to reply.</p>
      <button
        type="button"
        onClick={() => withdraw(offer.id)}
        disabled={isPending}
        className="shrink-0 text-[12px] font-semibold text-muted underline-offset-2 hover:text-ink hover:underline disabled:opacity-50"
      >
        Take back
      </button>
    </div>
  );
}

// Accept / counter / decline. The seller also sets, when needed, the
// category of a described item and the delivery fee (no delivery zones).
function AnswerForm({ offer, conversationId, isSeller }: { offer: Offer; conversationId: string; isSeller: boolean }) {
  const { mutate: respond, isPending } = useRespondOffer(conversationId);
  const { data: categories } = useCategories();
  const [mode, setMode] = useState<"idle" | "accept" | "counter">("idle");
  const [price, setPrice] = useState("");
  const [fee, setFee] = useState("");
  const [categoryId, setCategoryId] = useState(offer.categoryId ?? "");
  const [error, setError] = useState("");

  const needsCategory = isSeller && !offer.categoryId;
  const needsFee = isSeller && offer.store._count.shippingOptions === 0 && offer.deliveryFee === null;
  const field =
    "h-10 w-full rounded-lg border border-line bg-surface px-3 text-[16px] text-ink outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[13px]";

  const submit = (action: "ACCEPT" | "COUNTER") => {
    const amount = parseAmount(price);
    const deliveryFee = fee.trim() ? parseAmount(fee) : 0;
    if (action === "COUNTER" && !(amount > 0)) return setError("Enter your price, e.g. 15000.");
    if (needsCategory && !categoryId) return setError("Choose a category - it sets Nestly's commission.");
    if (needsFee && (Number.isNaN(deliveryFee) || deliveryFee < 0)) return setError("Enter the delivery fee, or 0 for free.");
    setError("");
    respond(
      {
        id: offer.id,
        data: {
          action,
          ...(action === "COUNTER" ? { price: amount } : {}),
          ...(needsCategory ? { categoryId } : {}),
          ...(needsFee ? { deliveryFee } : {}),
        },
      },
      { onSuccess: () => setMode("idle") }
    );
  };

  // Accepting needs nothing more from a buyer, or from a seller whose details are set.
  const simpleAccept = !needsCategory && !needsFee;

  if (mode === "idle") {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          disabled={isPending}
          onClick={() => (simpleAccept ? submit("ACCEPT") : setMode("accept"))}
          className="whitespace-nowrap flex h-9 items-center justify-center gap-1 rounded-lg bg-emerald-600 text-[12.5px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : null} Accept
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setMode("counter")}
          className="h-9 rounded-lg border border-line text-[12.5px] font-semibold text-ink-2 hover:border-violet-300 dark:hover:border-violet-500/40"
        >
          Counter
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => respond({ id: offer.id, data: { action: "DECLINE" } })}
          className="h-9 rounded-lg border border-line text-[12.5px] font-semibold text-red-600 hover:border-red-300 dark:text-red-400"
        >
          Decline
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {mode === "counter" && (
        <label className="block">
          <span className="mb-1 block text-[11.5px] font-semibold text-ink-2">Your price per item (₦)</span>
          <input
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setError("");
            }}
            inputMode="decimal"
            placeholder="e.g. 16500"
            className={field}
            autoFocus
          />
        </label>
      )}
      {needsCategory && (
        <label className="block">
          <span className="mb-1 block text-[11.5px] font-semibold text-ink-2">Category (sets Nestly&apos;s commission)</span>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setError("");
            }}
            className={field}
          >
            <option value="">Choose…</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.commissionRate}%)
              </option>
            ))}
          </select>
        </label>
      )}
      {needsFee && (
        <label className="block">
          <span className="mb-1 block text-[11.5px] font-semibold text-ink-2">Delivery fee you&apos;ll charge (₦)</span>
          <input
            value={fee}
            onChange={(e) => {
              setFee(e.target.value);
              setError("");
            }}
            inputMode="decimal"
            placeholder="0 for free delivery"
            className={field}
          />
        </label>
      )}
      {error && <p className="text-[11.5px] text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(mode === "accept" ? "ACCEPT" : "COUNTER")}
          className="whitespace-nowrap flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-violet-600 text-[12.5px] font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {isPending && <Loader2 size={13} className="animate-spin" />}
          {mode === "accept" ? "Accept offer" : "Send counter-offer"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("idle");
            setError("");
          }}
          className="h-9 rounded-lg px-3 text-[12.5px] font-semibold text-muted hover:text-ink"
        >
          Back
        </button>
      </div>
    </div>
  );
}
