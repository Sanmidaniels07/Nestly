"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  MapPin,
  Package,
  MessageCircle,
  Store,
  UserPlus,
  Star,
  Clock3,
} from "lucide-react";

import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerSummary({ seller }: Props) {
  return (
    <section className="mt-8 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex gap-4">
          <div className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2.5px]">
            <div className="rounded-full bg-white p-[2.5px]">
              <Image
                src={seller.avatar}
                alt={seller.name}
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="font-[family-name:var(--font-fraunces)] text-[24px] italic text-[#13131A]">
                {seller.name}
              </h3>
              {seller.verified && <BadgeCheck size={18} className="text-blue-500" />}
            </div>

            <p className="max-w-lg text-[14px] leading-relaxed text-[#64748B]">
              {seller.bio}
            </p>

            <div className="flex flex-wrap gap-4 text-[12.5px] text-[#64748B]">
              <div className="flex items-center gap-1">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="font-[family-name:var(--font-mono)]">{seller.rating}</span>{" "}
                rating
              </div>
              <div className="flex items-center gap-1">
                <Package size={13} />
                <span className="font-[family-name:var(--font-mono)]">{seller.productsCount}</span>{" "}
                products
              </div>
              <div className="flex items-center gap-1">
                <Clock3 size={13} />
                <span className="font-[family-name:var(--font-mono)]">{seller.responseRate}%</span>{" "}
                response
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={13} />
                {seller.distance}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Link
            href={`/marketplace/store/${seller.id}`}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
          >
            <Store size={15} />
            View store
          </Link>

          <button className="flex items-center gap-2 rounded-xl border border-violet-600 px-4 py-2.5 text-[13.5px] font-semibold text-violet-700 transition-colors hover:bg-violet-50">
            <UserPlus size={15} />
            Follow
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-[#ECE9F6] px-4 py-2.5 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]">
            <MessageCircle size={15} />
            Message
          </button>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-6 grid grid-cols-2 divide-x divide-y divide-[#EDEBF5] rounded-xl border border-[#EDEBF5] md:grid-cols-4 md:divide-y-0">
        {[
          { label: "Followers", value: seller.followers.toLocaleString() },
          { label: "Reviews", value: seller.reviews.toString() },
          { label: "Joined", value: seller.joined },
          { label: "Response", value: `${seller.responseRate}%`, tone: "text-emerald-600" },
        ].map((stat) => (
          <div key={stat.label} className="p-4">
            <p className="text-[11.5px] text-[#94A3B8]">{stat.label}</p>
            <h4
              className={`mt-1 font-[family-name:var(--font-mono)] text-[18px] font-semibold ${
                stat.tone ?? "text-[#13131A]"
              }`}
            >
              {stat.value}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
}