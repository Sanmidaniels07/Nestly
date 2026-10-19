"use client";

import { Address } from "@/src/types/address";
import { MapPin, Phone, User } from "lucide-react";

interface Props {
  address: Address;
}

export default function ShippingAddress({ address }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Shipping address
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
            <User size={15} className="text-violet-700 dark:text-violet-300" />
          </div>
          <span className="text-[13.5px] font-medium text-ink">{address.fullName}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
            <Phone size={15} className="text-violet-700 dark:text-violet-300" />
          </div>
          <span className="text-[13.5px] text-ink-3">{address.phone}</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
            <MapPin size={15} className="text-violet-700 dark:text-violet-300" />
          </div>
          <div>
            <p className="text-[13.5px] text-ink">{address.address}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {address.city}, {address.state}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
