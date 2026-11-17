"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, Loader2, Lock, Mail, RefreshCw, ShieldCheck, Store, UserRound } from "lucide-react";

import {
  useClaimGuestAccount,
  useConfirmGuestDelivery,
  useGuestOrder,
  useVerifyGuestOrder,
} from "@/src/hooks/use-payment-links";
import { useSession } from "@/src/hooks/use-session";
import { formatRelativeTime } from "@/src/lib/date";
import { orderReference } from "@/src/lib/support";
import { GuestOrder } from "@/src/types/payment-link";
import Skeleton from "@/src/components/ui/skeleton";
import OrderStatusBadge from "@/src/app/(protected)/marketplace/orders/components/order-status-badge";
import DeliveryCodes from "@/src/app/(protected)/marketplace/orders/[id]/components/delivery-codes";
import OrderedProducts from "@/src/app/(protected)/marketplace/orders/[id]/components/ordered-products";
import ShippingAddress from "@/src/app/(protected)/marketplace/orders/[id]/components/shipping-address";
import OrderTimeline from "@/src/app/(protected)/marketplace/orders/[id]/components/order-timeline";
import OrderSummary from "@/src/app/(protected)/marketplace/orders/[id]/components/order-summary";
import SoldOutNotice from "@/src/app/(protected)/marketplace/orders/[id]/components/sold-out-notice";

// Where someone who paid through a payment link without an account follows
// their order: status, delivery code, confirming it arrived - and turning
// it into a full account when they're ready.
export default function TrackOrderPage({ token }: { token: string }) {
  const { data: order, isLoading, isError } = useGuestOrder(token);
  const { mutate: confirm, isPending: isConfirming } = useConfirmGuestDelivery(token);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">We couldn&apos;t find this order</p>
        <p className="mt-1.5 text-[13.5px] text-muted">
          Open the link from your order email again. If you&apos;ve set up your Nestly account, your orders are under My orders.
        </p>
        <Link href="/marketplace/orders" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Go to My orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-20 pt-6 sm:pt-8">
      <div className="flex items-center gap-2 text-[12.5px] font-semibold text-emerald-700 dark:text-emerald-300">
        <Lock size={14} /> Your private order page · keep this link to yourself
      </div>

      <Header order={order} />
      {order.status === "PENDING" && <ConfirmingPayment token={token} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section className="min-w-0 space-y-5">
          <SoldOutNotice order={order} />
          <DeliveryCodes order={order} />
          <OrderedProducts
            order={order}
            guest={{ onConfirm: (itemId) => confirm(itemId), isConfirming }}
          />
          {order.address && order.address.address !== "Pickup" && (
            <ShippingAddress address={order.address} deliveryPhone={order.deliveryPhone} />
          )}
          {order.timeline && order.timeline.length > 0 && <OrderTimeline order={order} />}
        </section>

        <aside className="min-w-0 space-y-5">
          <AccountCard order={order} token={token} />
          <OrderSummary order={order} />
          <Protection />
        </aside>
      </div>
    </div>
  );
}

function Header({ order }: { order: GuestOrder }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[13px] text-muted">Hi {order.buyer.name.split(" ")[0]}, here&apos;s your order</p>
          <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink">{orderReference(order.id)}</h1>
          <p className="mt-1 text-[12.5px] text-subtle">Placed {formatRelativeTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.store && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-5">
          <Link href={`/marketplace/seller/${order.store.slug}`} className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              {order.store.logo ? <Image src={order.store.logo} alt="" fill sizes="40px" className="object-cover" /> : <Store size={17} />}
            </span>
            <span className="min-w-0">
              <span className="block text-[11.5px] text-subtle">Sold by</span>
              <span className="flex items-center gap-1 text-[14px] font-semibold text-ink">
                <span className="truncate">{order.store.name}</span>
                {order.store.isVerified && <BadgeCheck size={15} className="shrink-0 text-violet-600" aria-label="Verified business" />}
              </span>
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}

// Right after paying the order can still be PENDING for a moment (the
// webhook may land a little later). Check once on arrival, then on demand.
function ConfirmingPayment({ token }: { token: string }) {
  const { mutate: verify, isPending, isError } = useVerifyGuestOrder(token);
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    verify();
  }, [verify]);

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
      <div className="flex items-start gap-3">
        {isPending ? (
          <Loader2 size={18} className="mt-0.5 shrink-0 animate-spin text-amber-700 dark:text-amber-300" />
        ) : (
          <RefreshCw size={18} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
        )}
        <div>
          <p className="text-[13.5px] font-semibold text-amber-900 dark:text-amber-100">
            {isPending ? "Confirming your payment…" : "Waiting for your payment"}
          </p>
          <p className="mt-0.5 text-[12.5px] text-amber-900/80 dark:text-amber-100/80">
            {isError
              ? "We haven't received it yet. If you paid, it can take a minute - check again shortly."
              : "Once it's confirmed you'll get your delivery code here and by email."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => verify()}
        disabled={isPending}
        className="h-9 rounded-lg border border-amber-300 bg-surface px-3 text-[12.5px] font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-60 dark:border-amber-500/40 dark:text-amber-100 dark:hover:bg-amber-500/15"
      >
        Check again
      </button>
    </section>
  );
}

// Turn the guest checkout into a full account: set a password here (or a
// link is emailed when the account has older orders too).
function AccountCard({ order, token }: { order: GuestOrder; token: string }) {
  const { isLoggedIn } = useSession();
  const { mutate: claim, isPending, data: result } = useClaimGuestAccount(token);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ordersHref = `/marketplace/orders/${order.id}`;

  if (!order.buyer.isGuest || (result && !result.data.emailSent)) {
    return (
      <section id="account" className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/5">
        <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <CheckCircle2 size={17} className="text-emerald-600" /> This order is in your Nestly account
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
          Message the seller, report a problem or leave a review from your order page.
        </p>
        <Link
          href={isLoggedIn ? ordersHref : `/login?returnTo=${encodeURIComponent(ordersHref)}`}
          className="whitespace-nowrap mt-3 inline-flex h-10 items-center rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white hover:bg-violet-700"
        >
          {isLoggedIn ? "Open in My orders" : "Log in to see it"}
        </Link>
      </section>
    );
  }

  if (result?.data.emailSent) {
    return (
      <section id="account" className="rounded-2xl border border-violet-200 bg-violet-50/60 p-5 dark:border-violet-500/30 dark:bg-violet-500/10">
        <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <Mail size={17} className="text-violet-600 dark:text-violet-300" /> Check your email
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
          You&apos;ve ordered with this email before, so we&apos;ve sent a link to <strong className="text-ink-2">{result.data.email}</strong>{" "}
          to set your password. It keeps all your orders together.
        </p>
      </section>
    );
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError("Use at least 6 characters.");
    setError("");
    claim(password);
  };

  return (
    <section id="account" className="rounded-2xl border border-line bg-surface p-5">
      <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
        <UserRound size={17} className="text-violet-600 dark:text-violet-400" /> Save your details for next time
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
        Add a password to keep this order in a free Nestly account ({order.buyer.email}). You&apos;ll be able to message the seller,
        report a problem, leave a review and check out faster.
      </p>
      <form onSubmit={submit} className="mt-3 space-y-2.5">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="Choose a password"
          aria-label="Choose a password"
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
        />
        {error && <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="whitespace-nowrap flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13.5px] font-semibold text-white hover:brightness-110 disabled:opacity-70"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : null}
          Create my account
        </button>
      </form>
      <p className="mt-2.5 text-[11.5px] text-subtle">
        Prefer Google?{" "}
        <Link href={`/login?returnTo=${encodeURIComponent(ordersHref)}`} className="font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Continue with Google
        </Link>{" "}
        using the same email.
      </p>
    </section>
  );
}

function Protection() {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/5">
      <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
        <ShieldCheck size={17} className="text-emerald-600" /> Your money is protected
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
        Nestly holds your payment. Only give the seller your code once you have your order - that&apos;s what releases their money.
      </p>
    </section>
  );
}
