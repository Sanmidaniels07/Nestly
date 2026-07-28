"use client";

import { useMemo } from "react";
import { CheckCircle2, Truck } from "lucide-react";

import { useCart } from "@/src/hooks/use-cart";
import { useProduct } from "@/src/hooks/use-product";
import { useStore } from "@/src/hooks/use-store";
import { useCheckoutStore } from "@/src/store/checkout-store";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

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
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <Truck size={16} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-[#13131A]">Shipping</h2>
          <p className="text-[13px] text-[#64748B]">
            Choose a shipping option for each seller in your cart.
          </p>
        </div>
      </div>

      <div className="space-y-5">
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

  const selectedOptionId = useCheckoutStore(
    (state) => state.shippingSelections[storeId]?.shippingOptionId
  );
  const setShippingSelection = useCheckoutStore((state) => state.setShippingSelection);

  if (isLoading || !store) {
    return <div className="h-16 animate-pulse rounded-xl bg-[#F7F7FB]" />;
  }

  const options = store.shippingOptions ?? [];
  if (options.length === 0) return null;

  return (
    <div>
      <p className="text-[13.5px] font-semibold text-[#13131A]">{store.name}</p>

      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => {
          const selected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              onClick={() =>
                setShippingSelection(storeId, { shippingOptionId: option.id, fee: option.fee })
              }
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-violet-600 bg-violet-50"
                  : "border-[#ECE9F6] hover:border-violet-300"
              }`}
            >
              <div>
                <p className="text-[13px] font-medium text-[#13131A]">{option.name}</p>
                {typeof option.etaDays === "number" && (
                  <p className="mt-0.5 text-[12px] text-[#94A3B8]">
                    {option.etaDays} day{option.etaDays === 1 ? "" : "s"}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">
                  {money(option.fee)}
                </span>
                {selected && <CheckCircle2 size={16} className="text-violet-600" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
