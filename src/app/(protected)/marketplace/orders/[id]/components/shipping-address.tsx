"use client";

import { MarketplaceOrder } from "@/src/mocks/order";
import { MapPin, Phone, User } from "lucide-react";

interface Props {
  order: MarketplaceOrder;
}

export default function ShippingAddress({ order }: Props) {
  const address = order.shippingAddress;

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Shipping address
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
            <User size={15} className="text-violet-700" />
          </div>
          <span className="text-[13.5px] font-medium text-[#13131A]">{address.fullName}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
            <Phone size={15} className="text-violet-700" />
          </div>
          <span className="text-[13.5px] text-[#475569]">{address.phone}</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
            <MapPin size={15} className="text-violet-700" />
          </div>
          <div>
            <p className="text-[13.5px] text-[#13131A]">{address.address}</p>
            <p className="mt-0.5 text-[13px] text-[#64748B]">
              {address.city}, {address.state}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}