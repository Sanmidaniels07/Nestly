"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MapPin, Search, Store, Truck } from "lucide-react";

import { useCart } from "@/src/hooks/use-cart";
import { useProduct } from "@/src/hooks/use-product";
import { useStore } from "@/src/hooks/use-store";
import { useAddresses } from "@/src/hooks/use-addresses";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { ShippingOption } from "@/src/types/store";
import { DeliveryVehicle, canCarry, requiredVehicle, vehicleInfo } from "@/src/lib/delivery-vehicle";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

// Show a search box once a seller has more zones than fit at a glance.
const SEARCH_THRESHOLD = 5;

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// A zone matches when one of its areas appears in the buyer's street
// address, city or state (e.g. "Festac" in "12 3rd Avenue, Festac Town").
const zoneMatchesAddress = (zone: ShippingOption, addressText: string) =>
  !!addressText &&
  zone.areas.some((area) => {
    const needle = normalise(area);
    return needle.length > 1 && ` ${addressText} `.includes(` ${needle} `);
  });

export default function StoreShipping() {
  const { data: items } = useCart();

  // One group per store: a sample product (to look the store up) and the
  // biggest vehicle any of its items needs.
  const storeGroups = useMemo(() => {
    const map = new Map<string, { sampleProductId: string; products: { deliveryVehicle?: DeliveryVehicle }[] }>();
    items?.forEach((item) => {
      const group = map.get(item.product.storeId) ?? { sampleProductId: item.productId, products: [] };
      group.products.push(item.product);
      map.set(item.product.storeId, group);
    });
    return Array.from(map.entries()).map(
      ([storeId, group]) => [storeId, group.sampleProductId, requiredVehicle(group.products)] as const
    );
  }, [items]);

  if (storeGroups.length === 0) return null;

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <Truck size={16} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Delivery</h2>
          <p className="text-[13px] text-muted">Choose delivery to your area, or pick up yourself for free where offered.</p>
        </div>
      </div>

      <div className="space-y-6">
        {storeGroups.map(([storeId, sampleProductId, needed]) => (
          <StoreShippingGroup key={storeId} storeId={storeId} sampleProductId={sampleProductId} needed={needed} />
        ))}
      </div>
    </section>
  );
}

function StoreShippingGroup({
  storeId,
  sampleProductId,
  needed,
}: {
  storeId: string;
  sampleProductId: string;
  needed: DeliveryVehicle;
}) {
  const { data: product } = useProduct(sampleProductId);
  const slug = product?.store?.slug ?? "";
  const { data: store, isLoading } = useStore(slug);
  const { data: addresses } = useAddresses();
  const addressId = useCheckoutStore((state) => state.addressId);
  const [query, setQuery] = useState("");

  const selectedOptionId = useCheckoutStore((state) => state.shippingSelections[storeId]?.shippingOptionId);
  const setShippingSelection = useCheckoutStore((state) => state.setShippingSelection);
  const clearShippingSelection = useCheckoutStore((state) => state.clearShippingSelection);

  const address = addresses?.find((item) => item.id === addressId);
  const addressText = address ? normalise(`${address.address} ${address.city} ${address.state}`) : "";

  const allZones = store?.shippingOptions ?? [];
  const options = useMemo(() => {
    // Only zones whose vehicle can carry everything from this store.
    const zones = (store?.shippingOptions ?? []).filter((zone) => canCarry(zone, needed));
    // Zones covering the buyer's address first, then pickup, then cheapest.
    const rank = (option: { zone: ShippingOption; matches: boolean }) =>
      option.matches ? 0 : option.zone.type === "PICKUP" ? 1 : 2;
    return zones
      .map((zone) => ({ zone, matches: zone.type !== "PICKUP" && zoneMatchesAddress(zone, addressText) }))
      .sort((a, b) => rank(a) - rank(b) || a.zone.fee - b.zone.fee);
  }, [store?.shippingOptions, addressText, needed]);

  // A choice made before a bigger item was added may no longer fit - drop it
  // so the total and the payment step don't use it.
  useEffect(() => {
    if (!store || !selectedOptionId) return;
    if (!options.some(({ zone }) => zone.id === selectedOptionId)) clearShippingSelection(storeId);
  }, [store, options, selectedOptionId, storeId, clearShippingSelection]);

  if (isLoading || !store) {
    return <div className="h-16 animate-pulse rounded-xl bg-surface-2" />;
  }

  if (options.length === 0) {
    if (allZones.length === 0) return null;
    return (
      <div>
        <p className="text-[13.5px] font-semibold text-ink">{store.name}</p>
        <p className="mt-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          Your items from this seller need a {vehicleInfo(needed)?.label.toLowerCase()}, and they don&apos;t have a delivery zone for that yet.
          Remove the larger item or message the seller.
        </p>
      </div>
    );
  }

  const search = normalise(query);
  // Pickup stays visible while searching - it's available wherever the buyer is.
  const visible = search
    ? options.filter(
        ({ zone }) => zone.type === "PICKUP" || normalise(`${zone.name} ${zone.areas.join(" ")}`).includes(search)
      )
    : options;
  const hasMatch = options.some((option) => option.matches);
  const storeAddress = [store.address, store.city, store.state].filter(Boolean).join(", ");

  return (
    <div>
      <p className="text-[13.5px] font-semibold text-ink">{store.name}</p>
      {needed !== "BIKE" && (
        <p className="mt-0.5 text-[12px] text-subtle">
          Your items need a {vehicleInfo(needed)?.label.toLowerCase()} or bigger, so only those delivery options are shown.
        </p>
      )}
      {address && !hasMatch && (
        <p className="mt-0.5 text-[12px] text-subtle">
          None of this seller&apos;s zones mention your address. Search for your area or pick the closest one.
        </p>
      )}

      {options.length > SEARCH_THRESHOLD && (
        <div className="relative mt-2.5">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your area, e.g. Festac"
            aria-label={`Search ${store.name}'s delivery zones`}
            className="h-11 w-full rounded-xl border border-line bg-surface pl-9 pr-3.5 text-[13.5px] text-ink outline-none placeholder:text-subtle focus:border-violet-400"
          />
        </div>
      )}

      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
        {visible.map(({ zone, matches }) => {
          const selected = selectedOptionId === zone.id;

          return (
            <button
              key={zone.id}
              onClick={() => setShippingSelection(storeId, { shippingOptionId: zone.id, fee: zone.fee })}
              aria-pressed={selected}
              className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-violet-600 bg-violet-50 dark:bg-violet-500/10"
                  : "border-line hover:border-violet-300 dark:hover:border-violet-500/40"
              }`}
            >
              {zone.type === "PICKUP" ? (
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                    <Store size={13} className="shrink-0 text-violet-600 dark:text-violet-400" />
                    Pick up yourself
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-muted">
                    {zone.pickupAddress || storeAddress || "From the seller"}
                  </p>
                  {zone.eta && <p className="mt-0.5 text-[12px] text-subtle">{zone.eta}</p>}
                </div>
              ) : (
                <div className="min-w-0">
                  {matches && (
                    <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <MapPin size={11} /> Matches your address
                    </p>
                  )}
                  <p className="text-[13px] font-medium leading-snug text-ink">{zone.name}</p>
                  {(() => {
                    const info = vehicleInfo(zone.vehicle);
                    return info ? (
                      <p className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
                        <info.icon size={12} /> By {info.short.toLowerCase()}
                      </p>
                    ) : null;
                  })()}
                  {zone.eta && <p className="mt-0.5 text-[12px] text-subtle">{zone.eta}</p>}
                </div>
              )}
              <div className="flex shrink-0 items-center gap-2 pt-0.5">
                <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700 dark:text-violet-300">
                  {zone.fee === 0 ? "Free" : money(zone.fee)}
                </span>
                {selected && <CheckCircle2 size={16} className="text-violet-600 dark:text-violet-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="mt-2.5 text-[12.5px] text-subtle">No zone matches &quot;{query}&quot;. Try a nearby area.</p>
      )}
    </div>
  );
}
