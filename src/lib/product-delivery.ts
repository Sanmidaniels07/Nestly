import { canCarry } from "./delivery-vehicle";
import { stateLabel } from "./locations";
import type { Product } from "../types/product";
import type { ShippingOption, Store } from "../types/store";

export interface DeliveryRegion {
  state: string | null;
  areas: string[];
  minFee: number;
  maxFee: number;
  eta: string | null;
}

/** What a product page says about getting the item and sending it back. */
export interface ProductDelivery {
  regions: DeliveryRegion[];
  /** A zone with no areas: the seller delivers to any buyer at this fee. */
  flatRate: { fee: number; eta: string | null } | null;
  pickup: { city: string | null } | null;
  minFee: number | null;
  maxFee: number | null;
  shippingPolicy: string | null;
  /** Food, cakes, groceries: 24 hours to report a problem instead of 3 days. */
  perishable: boolean;
}

/**
 * Delivery for one product from its store's public zones: only zones whose
 * vehicle can carry it (same rule as checkout), grouped by state.
 */
export const summarizeDelivery = (
  store: Pick<Store, "city" | "shippingOptions" | "shippingPolicy">,
  product: Pick<Product, "deliveryVehicle" | "category">
): ProductDelivery => {
  const needed = product.deliveryVehicle ?? "BIKE";
  const zones = (store.shippingOptions ?? []).filter((zone: ShippingOption) => !zone.isArchived && canCarry(zone, needed));
  const delivery = zones.filter((zone) => zone.type === "DELIVERY");

  const byState = new Map<string, DeliveryRegion>();
  for (const zone of delivery.filter((z) => z.areas.length > 0)) {
    const key = zone.state ?? "";
    const region = byState.get(key) ?? { state: zone.state ?? null, areas: [], minFee: zone.fee, maxFee: zone.fee, eta: zone.eta ?? null };
    region.areas.push(...zone.areas.filter((area) => !region.areas.includes(area)));
    region.minFee = Math.min(region.minFee, zone.fee);
    region.maxFee = Math.max(region.maxFee, zone.fee);
    region.eta ??= zone.eta ?? null;
    byState.set(key, region);
  }
  const regions = [...byState.values()]
    .map((r) => ({ ...r, areas: [...r.areas].sort((a, b) => a.localeCompare(b)) }))
    .sort((a, b) => b.areas.length - a.areas.length);

  const anywhere = delivery.filter((zone) => zone.areas.length === 0).sort((a, b) => a.fee - b.fee)[0];
  const fees = delivery.map((zone) => zone.fee);

  return {
    regions,
    flatRate: anywhere ? { fee: anywhere.fee, eta: anywhere.eta ?? null } : null,
    pickup: zones.some((zone) => zone.type === "PICKUP") ? { city: store.city ?? null } : null,
    minFee: fees.length ? Math.min(...fees) : null,
    maxFee: fees.length ? Math.max(...fees) : null,
    shippingPolicy: store.shippingPolicy?.trim() || null,
    perishable: !!product.category?.isPerishable,
  };
};

export const regionLabel = (state: string | null) => (state ? stateLabel(state) : "Nigeria");
