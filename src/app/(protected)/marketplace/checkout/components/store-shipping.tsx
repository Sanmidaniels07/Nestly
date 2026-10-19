"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MapPin, Search, Store, Truck } from "lucide-react";

import { useCart } from "@/src/hooks/use-cart";
import { useProduct } from "@/src/hooks/use-product";
import { useStore } from "@/src/hooks/use-store";
import { useAddresses } from "@/src/hooks/use-addresses";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { ShippingOption } from "@/src/types/store";

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

  const storeGroups = useMemo(() => {
    const map = new Map<string, string>();
    items?.forEach((item) => {
      if (!map.has(item.product.storeId)) {
        map.set(item.product.storeId, item.productId);
      }
    });
    return Array.from(map.entries());
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
        {storeGroups.map(([storeId, sampleProductId]) => (
          <StoreShippingGroup key={storeId} storeId={storeId} sampleProductId={sampleProductId} />
        ))}
      </div>
    </section>
  );
}

function StoreShippingGroup({
  storeId,
  sampleProductId,
}: {
  storeId: string;
  sampleProductId: string;
}) {
  const { data: product } = useProduct(sampleProductId);
  const slug = product?.store?.slug ?? "";
  const { data: store, isLoading } = useStore(slug);
  const { data: addresses } = useAddresses();
  const addressId = useCheckoutStore((state) => state.addressId);
  const [query, setQuery] = useState("");

  const selectedOptionId = useCheckoutStore((state) => state.shippingSelections[storeId]?.shippingOptionId);
  const setShippingSelection = useCheckoutStore((state) => state.setShippingSelection);

  const address = addresses?.find((item) => item.id === addressId);
  const addressText = address ? normalise(`${address.address} ${address.city} ${address.state}`) : "";

  const options = useMemo(() => {
    const zones = store?.shippingOptions ?? [];
    // Zones covering the buyer's address first, then pickup, then cheapest.
    const rank = (option: { zone: ShippingOption; matches: boolean }) =>
      option.matches ? 0 : option.zone.type === "PICKUP" ? 1 : 2;
    return zones
      .map((zone) => ({ zone, matches: zone.type !== "PICKUP" && zoneMatchesAddress(zone, addressText) }))
      .sort((a, b) => rank(a) - rank(b) || a.zone.fee - b.zone.fee);
  }, [store?.shippingOptions, addressText]);

  if (isLoading || !store) {
    return <div className="h-16 animate-pulse rounded-xl bg-surface-2" />;
  }

  if (options.length === 0) return null;

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
