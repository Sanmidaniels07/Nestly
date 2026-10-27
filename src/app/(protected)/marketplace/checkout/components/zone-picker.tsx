"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MapPin, Search, Store } from "lucide-react";

import { useAddresses } from "@/src/hooks/use-addresses";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { ShippingOption } from "@/src/types/store";
import { DeliveryVehicle, canCarry, vehicleInfo } from "@/src/lib/delivery-vehicle";

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

export type ZoneOption = Pick<ShippingOption, "id" | "name" | "fee" | "eta" | "type" | "areas" | "pickupAddress" | "vehicle">;

// A zone matches when one of its areas appears in the buyer's street
// address, city or state (e.g. "Festac" in "12 3rd Avenue, Festac Town").
const zoneMatchesAddress = (zone: ZoneOption, addressText: string) =>
  !!addressText &&
  zone.areas.some((area) => {
    const needle = normalise(area);
    return needle.length > 1 && ` ${addressText} `.includes(` ${needle} `);
  });

interface Props {
  storeName: string;
  storeAddress: string;
  zones: ZoneOption[];
  // Biggest vehicle the items need - smaller zones are left out.
  needed: DeliveryVehicle;
  selectedId?: string;
  onSelect: (zone: ZoneOption) => void;
  onClear: () => void;
}

// One store's delivery zones and pickup points, ranked for the buyer's
// chosen checkout address (checkout and payment-link pages).
export default function ZonePicker({ storeName, storeAddress, zones, needed, selectedId, onSelect, onClear }: Props) {
  const { data: addresses } = useAddresses();
  const addressId = useCheckoutStore((state) => state.addressId);
  const [query, setQuery] = useState("");

  const address = addresses?.find((item) => item.id === addressId);
  const addressText = address ? normalise(`${address.address} ${address.city} ${address.state}`) : "";

  const options = useMemo(() => {
    // Only zones whose vehicle can carry the items.
    const usable = zones.filter((zone) => canCarry(zone, needed));
    // Zones covering the buyer's address first, then pickup, then cheapest.
    const rank = (option: { zone: ZoneOption; matches: boolean }) =>
      option.matches ? 0 : option.zone.type === "PICKUP" ? 1 : 2;
    return usable
      .map((zone) => ({ zone, matches: zone.type !== "PICKUP" && zoneMatchesAddress(zone, addressText) }))
      .sort((a, b) => rank(a) - rank(b) || a.zone.fee - b.zone.fee);
  }, [zones, addressText, needed]);

  // A choice made before a bigger item was added may no longer fit - drop it
  // so the total and the payment step don't use it.
  useEffect(() => {
    if (selectedId && !options.some(({ zone }) => zone.id === selectedId)) onClear();
  }, [options, selectedId, onClear]);

  if (options.length === 0) {
    return (
      <div>
        <p className="text-[13.5px] font-semibold text-ink">{storeName}</p>
        <p className="mt-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          {zones.length === 0
            ? "This seller hasn't set up delivery or pickup yet, so their items can't be ordered right now. Remove them from your cart to check out the rest."
            : `Your items from this seller need a ${vehicleInfo(needed)?.label.toLowerCase()}, and they don't have a delivery zone for that yet. Remove the larger item or message the seller.`}
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

  return (
    <div>
      <p className="text-[13.5px] font-semibold text-ink">{storeName}</p>
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
            aria-label={`Search ${storeName}'s delivery zones`}
            className="h-11 w-full rounded-xl border border-line bg-surface pl-9 pr-3.5 text-[13.5px] text-ink outline-none placeholder:text-subtle focus:border-violet-400"
          />
        </div>
      )}

      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
        {visible.map(({ zone, matches }) => {
          const selected = selectedId === zone.id;

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelect(zone)}
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
