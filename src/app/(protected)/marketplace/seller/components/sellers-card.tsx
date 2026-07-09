"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  MapPin,
  Star,
  Store,
  Users,
  Package,
  Clock3,
} from "lucide-react";

import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerCard({ seller }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_40px_-20px_rgba(124,58,237,0.25)]">
      <div className="relative h-32 w-full">
        <Image src={seller.coverImage} alt={seller.name} fill className="object-cover" />
      </div>

      {/* Seller */}
      <div className="relative px-6 pb-6">
        <div className="-mt-10 flex items-end gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white">
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" />
          </div>

          <div className="min-w-0 pb-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[16px] font-semibold text-[#13131A]">
                {seller.name}
              </h3>
              {seller.verified && (
                <BadgeCheck size={16} className="shrink-0 text-blue-500" />
              )}
            </div>

            <div className="mt-1 flex items-center gap-1">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[13px] font-semibold text-[#13131A]">{seller.rating}</span>
              <span className="text-[12px] text-[#94A3B8]">({seller.reviews})</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 line-clamp-2 text-[13px] leading-6 text-[#64748B]">{seller.bio}</p>

        {/* Statistics */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#F8F8FC] p-3.5">
            <Users size={16} className="text-violet-600" />
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[15px] font-semibold text-[#13131A]">
              {seller.followers.toLocaleString()}
            </p>
            <span className="text-[11px] text-[#64748B]">Followers</span>
          </div>

          <div className="rounded-xl bg-[#F8F8FC] p-3.5">
            <Package size={16} className="text-violet-600" />
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[15px] font-semibold text-[#13131A]">
              {seller.productsCount}
            </p>
            <span className="text-[11px] text-[#64748B]">Products</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-5 space-y-2.5 border-t border-dashed border-[#ECE9F6] pt-4 text-[13px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#64748B]">
              <MapPin size={14} />
              {seller.location}
            </div>
            <span className="text-[12px] text-[#94A3B8]">{seller.distance}</span>
          </div>

          <div className="flex items-center gap-2 text-[#64748B]">
            <Clock3 size={14} />
            Responds {seller.responseTime}
          </div>
        </div>

        <Link
          href={`/marketplace/seller/${seller.id}`}
          className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[13px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Store size={15} />
          Visit store
        </Link>
      </div>
    </article>
  );
}