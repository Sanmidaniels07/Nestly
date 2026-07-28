"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, Star, Store } from "lucide-react";

import { Store as StoreType } from "@/src/types/store";
import UserAvatar from "@/src/components/ui/user-avatar";

interface Props {
  seller: StoreType;
}

export default function SellerCard({ seller }: Props) {
  const location = [seller.city, seller.state].filter(Boolean).join(", ");
  const memberSince = new Date(seller.createdAt).getFullYear();

  return (
    <article className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_40px_-20px_rgba(124,58,237,0.25)]">
      <div className="relative h-32 w-full bg-gradient-to-br from-violet-100 to-indigo-100">
        {seller.banner && (
          <Image src={seller.banner} alt={seller.name} fill className="object-cover" />
        )}
      </div>

      <div className="relative px-6 pb-6">
        <div className="-mt-10 flex items-end gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white">
            {seller.logo ? (
              <Image src={seller.logo} alt={seller.name} fill className="object-cover" />
            ) : (
              <UserAvatar name={seller.name} size={80} />
            )}
          </div>

          <div className="min-w-0 pb-1">
            <h3 className="truncate text-[16px] font-semibold text-[#13131A]">
              {seller.name}
            </h3>

            {seller.rating !== undefined && (
              <div className="mt-1 flex items-center gap-1">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[13px] font-semibold text-[#13131A]">
                  {seller.rating}
                </span>
                {seller.reviewCount !== undefined && (
                  <span className="text-[12px] text-[#94A3B8]">
                    ({seller.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {seller.description && (
          <p className="mt-4 line-clamp-2 text-[13px] leading-6 text-[#64748B]">
            {seller.description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#F8F8FC] p-3.5">
            <Package size={16} className="text-violet-600" />
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[15px] font-semibold text-[#13131A]">
              {seller.productCount ?? "—"}
            </p>
            <span className="text-[11px] text-[#64748B]">Products</span>
          </div>

          <div className="rounded-xl bg-[#F8F8FC] p-3.5">
            <MapPin size={16} className="text-violet-600" />
            <p className="mt-2 truncate font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[#13131A]">
              {location || "—"}
            </p>
            <span className="text-[11px] text-[#64748B]">Location</span>
          </div>
        </div>

        <p className="mt-4 text-[12px] text-[#94A3B8]">Member since {memberSince}</p>

        <Link
          href={`/marketplace/seller/${seller.slug}`}
          className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Store size={15} />
          Visit store
        </Link>
      </div>
    </article>
  );
}
