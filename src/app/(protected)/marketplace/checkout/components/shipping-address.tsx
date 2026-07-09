"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import AddressCard from "./address-card";
import { addresses } from "@/src/mocks/shipping-address";
import { useCheckoutStore } from "@/src/store/checkout-store";

export default function ShippingAddress() {
  const selectedAddress = useCheckoutStore((state) => state.selectedAddress);

  const setAddress = useCheckoutStore((state) => state.setAddress);
  useEffect(() => {
    if (!selectedAddress) {
      const defaultAddress = addresses.find((a) => a.isDefault);

      if (defaultAddress) {
        setAddress(defaultAddress);
      }
    }
  }, []);
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
            Shipping address
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Select where your order should be delivered.
          </p>
        </div>

        <button className="flex h-10 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-violet-700">
          <Plus size={15} />
          Add address
        </button>
      </div>

      <div className="space-y-3.5">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selected={selectedAddress?.id === address.id}
            onSelect={() => setAddress(address)}
          />
        ))}
      </div>
    </section>
  );
}
