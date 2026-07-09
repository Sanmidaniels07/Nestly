"use client";

import { useEffect, useState } from "react";
import { deliveryOptions } from "@/src/mocks/delivery";
import DeliveryOptionCard from "./delivery-option-card";
import { useCheckoutStore } from "@/src/store/checkout-store";

export default function DeliveryMethod() {
  const selectedDelivery = useCheckoutStore((state) => state.selectedDelivery);

  const setDelivery = useCheckoutStore((state) => state.setDelivery);

  useEffect(() => {
    if (!selectedDelivery) {
      setDelivery(deliveryOptions[0]);
    }
  }, []);

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="mb-5">
        <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
          Delivery method
        </h2>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Choose how you want this order delivered.
        </p>
      </div>

      <div className="space-y-3.5">
        {deliveryOptions.map((option) => (
          <DeliveryOptionCard
            key={option.id}
            option={option}
            selected={selectedDelivery?.id === option.id}
            onSelect={() => setDelivery(option)}
          />
        ))}
      </div>
    </section>
  );
}
