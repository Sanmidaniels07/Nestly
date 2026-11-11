"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Gift,
  Link2,
  Loader2,
  Lock,
  MapPin,
  Search,
  ShieldCheck,
  Store,
  Truck,
  UserRound,
  X,
} from "lucide-react";

import { useProduct } from "@/src/hooks/use-product";
import { useStore } from "@/src/hooks/use-store";
import { useUserProfile } from "@/src/hooks/use-user-profile";
import { useUsers } from "@/src/hooks/use-users";
import { useSendGift } from "@/src/hooks/use-gifts";
import { useVerifyCheckout } from "@/src/hooks/use-verify-checkout";
import { useAuthStore } from "@/src/store/auth-store";
import { payWithPaystack } from "@/src/lib/paystack";
import { trafficSource } from "@/src/lib/traffic-source";
import { DeliveryVehicle, canCarry } from "@/src/lib/delivery-vehicle";
import { useGoBack } from "@/src/hooks/use-go-back";
import Skeleton from "@/src/components/ui/skeleton";
import { PublicUser } from "@/src/types/user";
import { ShippingOption } from "@/src/types/store";

const MESSAGE_MAX = 300;

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

export default function SendGiftPage() {
  return (
    <Suspense fallback={<ComposerSkeleton />}>
      <SendGift />
    </Suspense>
  );
}

function ComposerSkeleton() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <Skeleton className="h-[520px] w-full rounded-3xl" />
      <Skeleton className="h-80 w-full rounded-3xl" />
    </div>
  );
}

function SendGift() {
  const params = useSearchParams();
  const productId = params.get("product") ?? "";
  const toId = params.get("to") ?? "";
  const variationId = params.get("variation") ?? undefined;
  const quantity = Math.max(1, Math.min(10, Number(params.get("qty")) || 1));

  const { data: productResponse, isLoading } = useProduct(productId, undefined, { enabled: !!productId });
  const product = productResponse;
  const { data: store } = useStore(product?.store?.slug ?? "", undefined, { enabled: !!product?.store?.slug });
  const goBack = useGoBack(productId ? `/marketplace/product/${productId}` : "/marketplace");

  if (!productId) {
    return (
      <Empty
        title="Pick something to gift"
        text="Open any product and tap “Send as a gift”, or send something from a friend's wishlist."
      />
    );
  }
  if (isLoading || (product && !store)) return <ComposerSkeleton />;
  if (!product) return <Empty title="This item isn't available" text="It may have been removed. Try another one." />;

  const variation = product.variations?.find((v) => v.id === variationId) ?? null;
  if ((product.variations?.length ?? 0) > 0 && !variation) {
    return (
      <Empty
        title="Choose an option first"
        text="This item comes in options (like size or colour). Pick one on the product page, then tap Send as a gift."
        href={`/marketplace/product/${product.id}`}
        action="Back to the item"
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:pt-8">
      <button type="button" onClick={() => goBack()} className="mb-4 text-[13px] font-medium text-muted hover:text-violet-700 dark:hover:text-violet-300">
        ← Back
      </button>
      <div className="mb-6 flex items-center gap-3">
        <motion.span
          initial={{ rotate: -12, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
        >
          <Gift size={22} />
        </motion.span>
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">Send a gift</p>
          <h1 className="font-[family-name:var(--font-fraunces)] text-[30px] leading-tight text-ink sm:text-[36px]">
            Make someone&apos;s day
          </h1>
        </div>
      </div>

      <Composer
        product={{
          id: product.id,
          title: product.title,
          image: product.images?.find((i) => i.isPrimary)?.url ?? product.images?.[0]?.url ?? null,
          price: variation?.price ?? product.price,
          variantLabel: variation ? [variation.option1, variation.option2].filter(Boolean).join(" / ") : null,
          storeName: product.store?.name ?? "",
          vehicle: (product.deliveryVehicle ?? "BIKE") as DeliveryVehicle,
        }}
        variationId={variation?.id}
        quantity={quantity}
        zones={(store?.shippingOptions ?? []).filter((z) => !z.isArchived)}
        toId={toId}
      />
    </div>
  );
}

function Empty({ title, text, href = "/marketplace", action = "Browse the marketplace" }: { title: string; text: string; href?: string; action?: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <Gift className="mx-auto h-9 w-9 text-violet-500" strokeWidth={1.5} />
      <p className="mt-4 text-[16px] font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-[13.5px] text-muted">{text}</p>
      <Link href={href} className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
        {action}
      </Link>
    </div>
  );
}

interface ComposerProduct {
  id: string;
  title: string;
  image: string | null;
  price: number;
  variantLabel: string | null;
  storeName: string;
  vehicle: DeliveryVehicle;
}

function Composer({
  product,
  variationId,
  quantity,
  zones,
  toId,
}: {
  product: ComposerProduct;
  variationId?: string;
  quantity: number;
  zones: ShippingOption[];
  toId: string;
}) {
  const router = useRouter();
  const me = useAuthStore((state) => state.user);
  const { data: toProfile } = useUserProfile(toId);
  const [recipient, setRecipient] = useState<PublicUser | null>(null);
  const [mode, setMode] = useState<"nestly" | "link">("nestly");
  const [linkName, setLinkName] = useState("");
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const attemptRef = useRef(0);
  const { mutateAsync: sendGift } = useSendGift();
  const { mutateAsync: verifyCheckout } = useVerifyCheckout();

  // Coming from someone's wishlist: they're the recipient.
  const chosen = recipient ?? (toProfile && toProfile.id !== me?.id ? toProfile : null);
  const recipientName = mode === "nestly" ? chosen?.name ?? "" : linkName.trim();
  const usable = zones.filter((zone) => canCarry(zone, product.vehicle));
  const zone = usable.find((z) => z.id === zoneId) ?? null;
  const subtotal = product.price * quantity;
  const total = subtotal + (zone?.fee ?? 0);
  const who = recipientName ? firstName(recipientName) : "them";

  const send = async () => {
    if (mode === "nestly" && !chosen) return setError("Choose who the gift is for.");
    if (mode === "link" && !linkName.trim()) return setError("Add their name so the gift greets them.");
    if (!zone) return setError(`Choose where ${who} will receive it.`);

    const attempt = ++attemptRef.current;
    const isStale = () => attempt !== attemptRef.current;
    setError("");
    setProcessing(true);

    try {
      const { data } = await sendGift({
        productId: product.id,
        variationId,
        quantity,
        shippingOptionId: zone.id,
        recipientId: mode === "nestly" ? chosen?.id : undefined,
        recipientName,
        message: message.trim() || undefined,
        showPrice,
        source: trafficSource(),
      });
      await payWithPaystack(data.accessCode, {
        onSuccess: async () => {
          try {
            await verifyCheckout(data.reference);
            if (!isStale()) router.push(`/gift/${data.code}?sent=1`);
          } catch {
            if (!isStale()) router.push(`/gift/${data.code}`);
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
    } catch {
      if (!isStale()) setProcessing(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="min-w-0 space-y-5">
        <Step number={1} title="Who is it for?">
          <div className="mb-3 inline-flex rounded-xl border border-line bg-surface-2 p-1">
            {([
              { key: "nestly", label: "Someone on Nestly", icon: UserRound },
              { key: "link", label: "Send a link", icon: Link2 },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  mode === key ? "bg-surface text-violet-700 shadow-sm dark:text-violet-300" : "text-muted hover:text-ink"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {mode === "nestly" ? (
            chosen ? (
              <div className="flex items-center gap-3 rounded-2xl border border-violet-300 bg-violet-50/70 p-3 dark:border-violet-500/40 dark:bg-violet-500/10">
                <Avatar user={chosen} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{chosen.name}</p>
                  <p className="text-[12px] text-muted">We&apos;ll tell them as soon as you pay. They add their own address.</p>
                </div>
                <button type="button" onClick={() => setRecipient(null)} aria-label="Choose someone else" className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <PersonSearch excludeId={me?.id} onPick={setRecipient} />
            )
          ) : (
            <div>
              <label htmlFor="gift-name" className="text-[12.5px] font-semibold text-ink-2">
                Their name
              </label>
              <input
                id="gift-name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value.slice(0, 60))}
                placeholder="e.g. Tolu"
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
              />
              <p className="mt-2 text-[12px] text-muted">
                After paying you get a gift link to send on WhatsApp or anywhere. Whoever opens it first and accepts it gets the gift.
              </p>
            </div>
          )}
        </Step>

        <Step number={2} title={`Where will ${who} receive it?`}>
          <p className="-mt-1 mb-3 text-[12.5px] text-muted">
            Just the area - {who === "them" ? "they" : who} add{who === "them" ? "" : "s"} the exact address when accepting.
          </p>
          <ZoneList zones={usable} selectedId={zoneId} onSelect={setZoneId} storeName={product.storeName} />
        </Step>

        <Step number={3} title="Add a message (optional)">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
            rows={3}
            placeholder={`Happy birthday${recipientName ? `, ${firstName(recipientName)}` : ""}! 🎂`}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
          />
          <div className="mt-1 text-right font-[family-name:var(--font-mono)] text-[11px] text-subtle">
            {message.length}/{MESSAGE_MAX}
          </div>
          <button
            type="button"
            onClick={() => setShowPrice((value) => !value)}
            className="mt-2 flex w-full items-center gap-3 rounded-xl border border-line px-4 py-3 text-left hover:border-violet-300 dark:hover:border-violet-500/40"
          >
            {showPrice ? <Eye size={17} className="text-violet-600" /> : <EyeOff size={17} className="text-subtle" />}
            <span className="flex-1">
              <span className="block text-[13px] font-semibold text-ink">{showPrice ? "They'll see the price" : "Price hidden"}</span>
              <span className="block text-[11.5px] text-muted">Tap to {showPrice ? "hide" : "show"} what it cost</span>
            </span>
          </button>
        </Step>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <motion.div layout className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_24px_60px_-28px_rgba(124,58,237,0.35)]">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-amber-50 dark:from-violet-500/20 dark:via-fuchsia-500/10 dark:to-amber-500/5">
            {product.image && <Image src={product.image} alt={product.title} fill sizes="380px" className="object-cover" />}
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-violet-700 shadow">
              <Gift size={13} /> Gift{recipientName ? ` for ${firstName(recipientName)}` : ""}
            </span>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-[15px] font-semibold leading-snug text-ink">{product.title}</p>
              {product.variantLabel && <p className="text-[12.5px] text-muted">{product.variantLabel}</p>}
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-subtle">
                <Store size={12} /> {product.storeName}
              </p>
            </div>
            <AnimatePresence>
              {message.trim() && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-xl bg-violet-50 px-3.5 py-2.5 text-[13px] italic text-ink-2 dark:bg-violet-500/10"
                >
                  “{message.trim()}”
                </motion.p>
              )}
            </AnimatePresence>
            <dl className="space-y-2 text-[13.5px]">
              <div className="flex justify-between">
                <dt className="text-muted">{quantity > 1 ? `${quantity} × ${naira(product.price)}` : "Gift"}</dt>
                <dd className="font-[family-name:var(--font-mono)] text-ink">{naira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{zone?.type === "PICKUP" ? "Pickup" : "Delivery"}</dt>
                <dd className="font-[family-name:var(--font-mono)] text-ink">{zone ? (zone.fee > 0 ? naira(zone.fee) : "Free") : "Choose area"}</dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-line pt-2.5 text-[15px] font-semibold">
                <dt className="text-ink">Total</dt>
                <dd className="font-[family-name:var(--font-mono)] text-violet-700 dark:text-violet-300">{naira(total)}</dd>
              </div>
            </dl>
          </div>
        </motion.div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={send}
          disabled={processing}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:brightness-110 disabled:opacity-70"
        >
          {processing ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Processing payment…
            </>
          ) : (
            <>
              <Lock size={16} /> Pay {naira(total)} &amp; send gift
            </>
          )}
        </button>

        <ul className="space-y-2 rounded-2xl bg-surface-2 p-4 text-[12px] text-muted">
          {[
            `${who === "them" ? "They" : who} add${who === "them" ? "" : "s"} their own address - you don't need it.`,
            "The seller is paid only after the gift is accepted.",
            "Not accepted within 7 days, or declined? You're refunded in full.",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-600" /> {line}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: number * 0.06 }}
      className="rounded-3xl border border-line bg-surface p-5 sm:p-6"
    >
      <h2 className="mb-4 flex items-center gap-2.5 text-[15.5px] font-semibold text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 font-[family-name:var(--font-mono)] text-[12px] text-white">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function Avatar({ user }: { user: Pick<PublicUser, "name" | "avatar"> }) {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-[14px] font-bold text-white">
      {user.avatar ? <Image src={user.avatar} alt="" fill sizes="40px" className="object-cover" /> : user.name.charAt(0).toUpperCase()}
    </span>
  );
}

function PersonSearch({ excludeId, onPick }: { excludeId?: string; onPick: (user: PublicUser) => void }) {
  const [query, setQuery] = useState("");
  const search = query.trim();
  const { data, isFetching } = useUsers({ search: search || undefined, limit: 6 });
  const people = (data?.users ?? []).filter((user) => user.id !== excludeId);

  return (
    <div>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username"
          className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-4 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
        />
        {isFetching && <Loader2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-subtle" />}
      </div>
      {search && (
        <ul className="mt-2 divide-y divide-line-soft overflow-hidden rounded-xl border border-line">
          {people.length === 0 && !isFetching && <li className="px-4 py-3 text-[12.5px] text-muted">No one found - try “Send a link” instead.</li>}
          {people.map((user) => (
            <li key={user.id}>
              <button type="button" onClick={() => onPick(user)} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-surface-2">
                <Avatar user={user} />
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold text-ink">{user.name}</span>
                  {user.username && <span className="block text-[12px] text-muted">@{user.username}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SEARCH_THRESHOLD = 5;

function ZoneList({
  zones,
  selectedId,
  onSelect,
  storeName,
}: {
  zones: ShippingOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  storeName: string;
}) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? zones.filter((z) => [z.name, z.state ?? "", ...z.areas].some((text) => text.toLowerCase().includes(q)))
      : zones;
    // Delivery zones first (cheapest first), then pickup points.
    return [...list].sort((a, b) => Number(a.type === "PICKUP") - Number(b.type === "PICKUP") || a.fee - b.fee);
  }, [zones, query]);

  if (zones.length === 0) {
    return <p className="text-[13px] text-muted">{storeName} can&apos;t deliver this item right now. Try another item.</p>;
  }

  return (
    <div className="space-y-2.5">
      {zones.length > SEARCH_THRESHOLD && (
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an area, e.g. Lekki"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 sm:text-[13.5px]"
          />
        </div>
      )}
      {shown.map((zone) => {
        const active = zone.id === selectedId;
        const isPickup = zone.type === "PICKUP";
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
              active ? "border-violet-500 bg-violet-50 dark:border-violet-400/60 dark:bg-violet-500/10" : "border-line hover:border-violet-300 dark:hover:border-violet-500/40"
            }`}
          >
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? "bg-violet-600 text-white" : "bg-surface-2 text-violet-600 dark:text-violet-300"}`}>
              {active ? <Check size={15} /> : isPickup ? <Store size={15} /> : <Truck size={15} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-[13.5px] font-semibold text-ink">{isPickup ? `Pickup - ${zone.name}` : zone.name}</span>
                <span className="shrink-0 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-ink">{zone.fee > 0 ? naira(zone.fee) : "Free"}</span>
              </span>
              <span className="mt-0.5 flex items-start gap-1 text-[12px] text-muted">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">
                  {isPickup
                    ? zone.pickupAddress ?? "Collected from the store"
                    : zone.areas.length
                      ? `${zone.areas.join(", ")}${zone.state ? `, ${zone.state}` : ""}`
                      : zone.state ?? "Anywhere they deliver"}
                </span>
              </span>
              {zone.eta && <span className="mt-0.5 block text-[11.5px] text-subtle">{zone.eta}</span>}
            </span>
          </button>
        );
      })}
      {shown.length === 0 && <p className="px-1 text-[12.5px] text-muted">No area matches “{query}”.</p>}
    </div>
  );
}
