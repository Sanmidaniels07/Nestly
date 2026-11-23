"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Check, Clock, Copy, Gift, Loader2, Lock, PartyPopper, ShieldCheck, Store, Users, X } from "lucide-react";
import toast from "react-hot-toast";

import { useCancelGroupGift, useContribute, useGroupGift } from "@/src/hooks/use-group-gift";
import { useRequireLogin, useSession } from "@/src/hooks/use-session";
import { useFormDraft } from "@/src/hooks/use-form-draft";
import { verifyContribution } from "@/src/services/group-gift.services";
import { payWithPaystack } from "@/src/lib/paystack";
import { naira } from "@/src/lib/payment-link";
import { shareLinks } from "@/src/lib/social";
import { SITE_URL } from "@/src/lib/site";
import Skeleton from "@/src/components/ui/skeleton";
import { WhatsAppIcon } from "@/src/components/ui/social-icons";
import { ApiErrorResponse } from "@/src/types/api";
import { GroupGiftView } from "@/src/types/group-gift";

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

// Chip in on a gift: what it is, who it's for, how close friends are, and
// a box to add your part. Nestly holds everything until the total is
// reached - then the gift is sent - or refunds everyone.
export default function ChipInPage({ code }: { code: string }) {
  const { data, isLoading, isError } = useGroupGift(code);

  if (isLoading || (!data && !isError)) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">This group gift doesn&apos;t exist</p>
        <p className="mt-1.5 text-[13.5px] text-muted">Check the link with whoever sent it.</p>
      </div>
    );
  }

  if (data.surprise) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <Gift size={40} className="mx-auto text-violet-600" />
        <p className="mt-4 font-[family-name:var(--font-fraunces)] text-[24px] text-ink">Something&apos;s coming, {firstName(data.recipientName)} 🎁</p>
        <p className="mt-1.5 text-[13.5px] text-muted">Your friends are up to something. We&apos;ll tell you when it&apos;s ready - no peeking!</p>
      </div>
    );
  }

  return <GroupGiftContent gift={data} />;
}

function GroupGiftContent({ gift }: { gift: GroupGiftView }) {
  const search = useSearchParams();
  const percent = Math.min(100, Math.round((gift.raised / gift.target) * 100));
  const who = firstName(gift.recipientName);
  const open = gift.status === "OPEN";
  const [now] = useState(() => Date.now());
  const hoursLeft = Math.max(0, Math.round((new Date(gift.deadline).getTime() - now) / 3_600_000));
  const timeLeft = hoursLeft >= 48 ? `${Math.round(hoursLeft / 24)} days left` : hoursLeft >= 1 ? `${hoursLeft} hours left` : "Closing soon";

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 pb-20 pt-6 sm:pt-8">
      {search.get("started") && open && gift.isOrganizer && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-[13px] text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100">
          <PartyPopper size={18} className="mt-0.5 shrink-0" />
          <span>
            Your group gift is ready. <strong>Share the link with friends</strong> - and chip in your own part below.
          </span>
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_24px_60px_-28px_rgba(124,58,237,0.35)]">
        <div className="flex gap-4 p-5 sm:p-6">
          <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 via-fuchsia-50 to-amber-50 dark:from-violet-500/20 dark:via-fuchsia-500/10 dark:to-amber-500/5">
            {gift.product.image ? (
              <Image src={gift.product.image} alt="" fill sizes="96px" className="object-cover" />
            ) : (
              <Gift size={30} className="absolute inset-0 m-auto text-violet-600" />
            )}
          </span>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-mono)] text-[11.5px] font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Group gift for {who}
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[22px] leading-tight text-ink">{gift.product.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-[12.5px] text-muted">
              <Store size={12} /> {gift.store.name}
            </p>
            <p className="mt-1 text-[12.5px] text-subtle">Started by {gift.organizer.name}</p>
          </div>
        </div>

        {gift.message && <p className="mx-5 mb-4 rounded-xl bg-violet-50 px-4 py-3 text-[13.5px] italic text-ink-2 dark:bg-violet-500/10 sm:mx-6">&ldquo;{gift.message}&rdquo;</p>}

        <div className="border-t border-line px-5 py-5 sm:px-6">
          <div className="flex items-end justify-between gap-3">
            <p className="font-[family-name:var(--font-mono)] text-[24px] font-semibold text-ink">
              {naira(gift.raised)} <span className="text-[14px] font-normal text-muted">of {naira(gift.target)}</span>
            </p>
            <p className="text-[13px] font-semibold text-violet-700 dark:text-violet-300">{percent}%</p>
          </div>
          <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 transition-[width] duration-700" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-muted">
            <span className="flex items-center gap-1">
              <Users size={13} /> {gift.contributors.length} {gift.contributors.length === 1 ? "person has" : "people have"} chipped in
            </span>
            {open && (
              <span className="flex items-center gap-1">
                <Clock size={13} /> {timeLeft}
              </span>
            )}
          </div>
        </div>
      </section>

      <StatusPanel gift={gift} />
      {open && <ContributeBox gift={gift} />}
      {open && <ShareBox gift={gift} />}

      {gift.contributors.length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-[14.5px] font-semibold text-ink">Who&apos;s in</h2>
          <ul className="mt-3 space-y-2.5">
            {gift.contributors.map((person, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-[13px] font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  {person.avatar ? <Image src={person.avatar} alt="" fill sizes="36px" className="object-cover" /> : (person.name ?? "?").charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink">{person.name ?? "Someone"}</p>
                  {person.message && <p className="text-[12.5px] text-ink-2">{person.message}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul className="space-y-2 rounded-2xl bg-surface-2 p-4 text-[12px] text-muted">
        {[
          "Nestly holds every contribution - nobody gets the money until the gift is sent.",
          `When the total is reached, the gift is sent to ${who} straight away. They add their own address.`,
          "Not reached by the deadline, or called off? Everyone is refunded in full.",
        ].map((line) => (
          <li key={line} className="flex gap-2">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-600" /> {line}
          </li>
        ))}
      </ul>

      {open && gift.isOrganizer && <CancelRow code={gift.code} />}
    </div>
  );
}

function StatusPanel({ gift }: { gift: GroupGiftView }) {
  const who = firstName(gift.recipientName);
  if (gift.status === "FUNDED") {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <PartyPopper size={28} className="mx-auto text-emerald-600" />
        <p className="mt-2 text-[16px] font-semibold text-ink">You did it! The gift is on its way to {who} 🎉</p>
        <p className="mt-1 text-[13px] text-muted">We&apos;ve told {who}. Once they add their address, the seller sends it.</p>
        {gift.giftCode && (
          <Link href={`/gift/${gift.giftCode}`} className="mt-3 inline-block text-[13px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
            Follow the gift
          </Link>
        )}
      </section>
    );
  }
  if (gift.status !== "OPEN") {
    const reason =
      gift.status === "CANCELLED"
        ? `${gift.organizer.name} called this group gift off.`
        : gift.status === "EXPIRED"
          ? "The deadline passed before the total was reached."
          : "The gift couldn't be placed - the item sold out or the shop closed.";
    return (
      <section className="rounded-2xl border border-line bg-surface p-5 text-center">
        <p className="text-[15px] font-semibold text-ink">This group gift has closed</p>
        <p className="mt-1 text-[13px] text-muted">{reason} Everyone who chipped in is refunded in full.</p>
      </section>
    );
  }
  if (gift.myContribution) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
        <Check size={16} /> You chipped in {naira(gift.myContribution)}. Thank you!
      </p>
    );
  }
  return null;
}

function ContributeBox({ gift }: { gift: GroupGiftView }) {
  const queryClient = useQueryClient();
  const { isLoggedIn, isHydrated } = useSession();
  const requireLogin = useRequireLogin();
  const { mutateAsync: contribute } = useContribute(gift.code);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [hideName, setHideName] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const attemptRef = useRef(0);

  // Amount and message are kept in this browser until they've paid (e.g. they
  // had to log in first, or refreshed). Brought back quietly - it's a small box.
  const { clear: clearSaved } = useFormDraft(
    `chip-in:${gift.code}`,
    { amount, message, hideName },
    (saved) => {
      setAmount(saved.amount ?? "");
      setMessage(saved.message ?? "");
      setHideName(!!saved.hideName);
    },
    { isEmpty: (draft) => !draft.amount.trim() && !draft.message.trim() && !draft.hideName }
  );

  const remaining = gift.remaining;
  const presets = [2000, 5000, 10000].filter((value) => value < remaining);
  const value = amount.trim() ? Number(amount.replace(/[,\s₦]/g, "")) : NaN;
  const minimum = Math.min(gift.minContribution, remaining);

  const pay = async () => {
    if (!requireLogin("Log in or create a free account to chip in.")) return;
    if (!(value > 0)) return setError("Choose or enter how much you'd like to chip in.");
    if (value < minimum) return setError(`The smallest contribution is ${naira(minimum)}.`);
    if (value > remaining) return setError(`Only ${naira(remaining)} is left.`);

    const attempt = ++attemptRef.current;
    const isStale = () => attempt !== attemptRef.current;
    setError("");
    setProcessing(true);
    try {
      const { data } = await contribute({ amount: value, message: message.trim() || undefined, hideName });
      await payWithPaystack(data.accessCode, {
        onSuccess: async () => {
          await verifyContribution(data.reference).catch(() => undefined);
          await queryClient.invalidateQueries({ queryKey: ["group-gift", gift.code] });
          clearSaved();
          if (!isStale()) {
            toast.success("Thank you for chipping in!");
            setAmount("");
            setMessage("");
            setProcessing(false);
          }
        },
        onCancel: () => {
          if (!isStale()) setProcessing(false);
        },
        onError: (msg) => {
          if (!isStale()) {
            setError(msg || "Payment failed. Please try again.");
            setProcessing(false);
          }
        },
      });
    } catch (err) {
      if (!isStale()) {
        setError((err as AxiosError<ApiErrorResponse>).response?.data?.message ?? "Couldn't start the payment.");
        setProcessing(false);
      }
    }
  };

  const chip =
    "h-10 rounded-xl border px-3.5 text-[13px] font-semibold transition-colors";
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-[15px] font-semibold text-ink">{gift.myContribution ? "Add a bit more" : "Chip in"}</h2>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
            className={`${chip} ${value === preset ? "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200" : "border-line text-ink-2 hover:border-violet-300"}`}
          >
            {naira(preset)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAmount(String(remaining))}
          className={`${chip} ${value === remaining ? "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200" : "border-line text-ink-2 hover:border-violet-300"}`}
        >
          The rest ({naira(remaining)})
        </button>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Or another amount (₦)</span>
        <input
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          inputMode="decimal"
          placeholder={`${naira(minimum)} or more`}
          className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">
          A note for the group <span className="font-normal text-subtle">(optional)</span>
        </span>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 200))}
          placeholder={`e.g. Happy birthday ${firstName(gift.recipientName)}! 🎂`}
          className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
        />
      </label>
      <label className="flex items-center gap-2.5 text-[13px] text-ink-2">
        <input type="checkbox" checked={hideName} onChange={(e) => setHideName(e.target.checked)} className="h-4 w-4 accent-violet-600" />
        Don&apos;t show my name (shown as &ldquo;Someone&rdquo;)
      </label>

      {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

      <button
        type="button"
        onClick={pay}
        disabled={processing || !isHydrated}
        className="whitespace-nowrap flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-[14px] font-semibold text-white shadow-lg shadow-violet-500/20 hover:brightness-110 disabled:opacity-70"
      >
        {processing ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
        {isLoggedIn || !isHydrated ? `Chip in${value > 0 ? ` ${naira(value)}` : ""} securely` : "Log in to chip in"}
      </button>
    </section>
  );
}

function ShareBox({ gift }: { gift: GroupGiftView }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/chip-in/${gift.code}`;
  const message = `We're chipping in for ${firstName(gift.recipientName)}'s gift on Nestly 🎁 Add your part - you're refunded if it doesn't come together:`;
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
    <section className="space-y-2.5 rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-[14.5px] font-semibold text-ink">Invite friends</h2>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-sunken p-1.5 pl-3.5">
        <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono)] text-[12.5px] text-ink-2">{url.replace(/^https?:\/\//, "")}</p>
        <button type="button" onClick={copy} className="whitespace-nowrap flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12.5px] font-semibold text-white">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <a
        href={shareLinks(url, message).whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line text-[13px] font-semibold text-ink-2 hover:border-violet-300"
      >
        <WhatsAppIcon size={16} className="text-emerald-600" /> Share on WhatsApp
      </a>
    </section>
  );
}

function CancelRow({ code }: { code: string }) {
  const { mutate: cancel, isPending } = useCancelGroupGift(code);
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="text-center">
      {confirming ? (
        <div className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2 text-[12.5px] dark:border-red-500/30 dark:bg-red-500/10">
          <span className="px-1 text-red-800 dark:text-red-200">Call it off and refund everyone?</span>
          <button type="button" onClick={() => cancel()} disabled={isPending} className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white disabled:opacity-60">
            {isPending ? "Calling off…" : "Yes, call it off"}
          </button>
          <button type="button" onClick={() => setConfirming(false)} aria-label="Keep it" className="rounded-lg p-1.5 text-muted hover:text-ink">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="text-[12.5px] font-semibold text-muted hover:text-red-600">
          Call off this group gift
        </button>
      )}
    </div>
  );
}
