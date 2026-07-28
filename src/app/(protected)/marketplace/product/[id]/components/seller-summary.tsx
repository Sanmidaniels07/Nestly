"use client";

import Link from "next/link";
import { MapPin, Store } from "lucide-react";

import { ProductStoreSummary } from "@/src/types/product";
import UserAvatar from "@/src/components/ui/user-avatar";

interface Props {
  store: ProductStoreSummary;
}

export default function SellerSummary({ store }: Props) {
  const location = [store.city, store.state].filter(Boolean).join(", ");

  return (
    <section className="mt-8 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {store.logo ? (
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full">
              <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <UserAvatar name={store.name} size={72} />
          )}

          <div className="space-y-1.5">
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
              {store.name}
            </h3>

            {location && (
              <div className="flex items-center gap-1 text-[12.5px] text-[#64748B]">
                <MapPin size={13} />
                {location}
              </div>
            )}
          </div>
        </div>

        <Link
          href={`/marketplace/seller/${store.slug}`}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Store size={15} />
          View store
        </Link>
      </div>
    </section>
  );
}
