"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, MessageCircle, Store, Truck } from "lucide-react";

import { Order, OrderItem } from "@/src/types/order";
import { useCreateConversation } from "@/src/hooks/use-create-conversation";
import { money, Shop, shopsIn } from "./order-helpers";

// What was bought, from whom, how it travels, and what it cost.
export default function OrderSummaryCard({ order }: { order: Order }) {
  const shops = shopsIn(order);
  const subtotal = order.subtotal ?? order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const delivery = order.deliveryFee ?? (order.shipping ?? []).reduce((sum, shipment) => sum + shipment.fee, 0);
  const address = order.address;
  const anyDelivery = (order.shipping ?? []).some((shipment) => shipment.type !== "PICKUP");

  return (
    <section className="overflow-hidden rounded-[24px] border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-7">
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] text-ink">Your order</h2>
        <Link href={`/marketplace/orders/${order.id}`} className="text-[13px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Order details
        </Link>
      </div>

      <div className="mt-4 divide-y divide-line">
        {shops.map((shop) => (
          <ShopBlock key={shop.id} shop={shop} />
        ))}
      </div>

      {anyDelivery && address && (
        <div className="flex items-start gap-3 border-t border-line px-5 py-4 sm:px-7">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-violet-600 dark:text-violet-400">
            <MapPin size={15} />
          </span>
          <div className="min-w-0 text-[13px] leading-relaxed">
            <p className="font-semibold text-ink">Delivering to {address.fullName}</p>
            <p className="text-muted">{[address.address, address.city, address.state].filter(Boolean).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="space-y-2 border-t border-dashed border-line bg-surface-sunken/60 px-5 py-4 text-[13.5px] sm:px-7">
        <Row label="Items" value={money(subtotal)} />
        <Row label={anyDelivery || !(order.shipping ?? []).length ? "Delivery" : "Pickup"} value={delivery > 0 ? money(delivery) : "Free"} />
        {!!order.discountAmount && order.discountAmount > 0 && (
          <Row label={order.couponCode ? `Discount (${order.couponCode})` : "Discount"} value={`- ${money(order.discountAmount)}`} accent />
        )}
        <div className="flex items-baseline justify-between border-t border-line pt-2.5">
          <span className="font-semibold text-ink">Total paid</span>
          <span className="font-[family-name:var(--font-mono)] text-[19px] font-bold text-ink">{money(order.total)}</span>
        </div>
      </div>
    </section>
  );
}

function ShopBlock({ shop }: { shop: Shop }) {
  const shipment = shop.shipping;
  return (
    <div className="px-5 py-4 sm:px-7">
      <div className="flex items-center justify-between gap-3">
        <ShopLink slug={shop.slug}>
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            {shop.logo ? <Image src={shop.logo} alt="" fill sizes="36px" className="object-cover" /> : <Store size={16} />}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold text-ink">{shop.name}</span>
            {shipment && (
              <span className="flex min-w-0 items-center gap-1 text-[12px] text-muted">
                {shipment.type === "PICKUP" ? <MapPin size={11} className="shrink-0" /> : <Truck size={11} className="shrink-0" />}
                {/* Zone names can be long ("Balogun Market / Ikoyi / Lekki..."): one line. */}
                <span className="min-w-0 truncate">{shipment.type === "PICKUP" ? "Pickup" : shipment.optionName}</span>
                <span className="shrink-0">{shipment.fee > 0 ? `· ${money(shipment.fee)}` : shipment.type === "PICKUP" ? "" : "· Free"}</span>
              </span>
            )}
          </span>
        </ShopLink>
        {shop.sellerUserId && <MessageSeller sellerUserId={shop.sellerUserId} />}
      </div>

      <ul className="mt-3.5 space-y-3">
        {shop.items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function ShopLink({ slug, children }: { slug?: string; children: React.ReactNode }) {
  const className = "flex min-w-0 items-center gap-2.5";
  return slug ? (
    <Link href={`/marketplace/seller/${slug}`} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

function ItemRow({ item }: { item: OrderItem }) {
  const image = item.productImage ?? item.product?.images?.find((img) => img.isPrimary)?.url ?? item.product?.images?.[0]?.url;
  const title = item.productTitle ?? item.product?.title ?? "Item";
  return (
    <li className="flex items-center gap-3.5">
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-sunken">
        {image && <Image src={image} alt={title} fill sizes="64px" className="object-cover" />}
        {item.quantity > 1 && (
          <span className="absolute right-1 top-1 rounded-full bg-ink/80 px-1.5 text-[10.5px] font-bold text-white">×{item.quantity}</span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[14px] font-medium leading-snug text-ink">{title}</p>
        <p className="mt-0.5 text-[12px] text-muted">
          {item.variantLabel ? `${item.variantLabel} · ` : ""}
          {item.quantity} × {money(item.unitPrice)}
        </p>
      </div>
      <p className="shrink-0 font-[family-name:var(--font-mono)] text-[14px] font-semibold text-ink">{money(item.totalPrice)}</p>
    </li>
  );
}

function MessageSeller({ sellerUserId }: { sellerUserId: string }) {
  const router = useRouter();
  const { mutate: createConversation, isPending } = useCreateConversation();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => createConversation(sellerUserId, { onSuccess: (response) => router.push(`/messages/${response.data.id}`) })}
      className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-2 transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-60 dark:hover:border-violet-500/40 dark:hover:text-violet-300"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
      Message
    </button>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className={`font-[family-name:var(--font-mono)] font-medium ${accent ? "text-emerald-700 dark:text-emerald-400" : "text-ink-2"}`}>{value}</span>
    </div>
  );
}
