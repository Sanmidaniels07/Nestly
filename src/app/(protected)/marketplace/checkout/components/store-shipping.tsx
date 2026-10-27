"use client";

import { useCallback, useMemo } from "react";
import { Truck } from "lucide-react";

import { useCart } from "@/src/hooks/use-cart";
import { useProduct } from "@/src/hooks/use-product";
import { useStore } from "@/src/hooks/use-store";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { DeliveryVehicle, requiredVehicle } from "@/src/lib/delivery-vehicle";
import ZonePicker from "./zone-picker";

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

  const selectedOptionId = useCheckoutStore((state) => state.shippingSelections[storeId]?.shippingOptionId);
  const setShippingSelection = useCheckoutStore((state) => state.setShippingSelection);
  const clearShippingSelection = useCheckoutStore((state) => state.clearShippingSelection);
  const clear = useCallback(() => clearShippingSelection(storeId), [clearShippingSelection, storeId]);

  if (isLoading || !store) {
    return <div className="h-16 animate-pulse rounded-xl bg-surface-2" />;
  }

  return (
    <ZonePicker
      storeName={store.name}
      storeAddress={[store.address, store.city, store.state].filter(Boolean).join(", ")}
      zones={store.shippingOptions ?? []}
      needed={needed}
      selectedId={selectedOptionId}
      onSelect={(zone) => setShippingSelection(storeId, { shippingOptionId: zone.id, fee: zone.fee })}
      onClear={clear}
    />
  );
}
