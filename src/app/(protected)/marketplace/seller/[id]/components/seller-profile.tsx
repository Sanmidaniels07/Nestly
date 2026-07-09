"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, MapPin, Users, MessageCircle, Check } from "lucide-react";
import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerProfile({ seller }: Props) {
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(seller.followers);

  const toggleFollow = () => {
    setFollowing((prev) => !prev);
    setFollowerCount((prev) => (following ? prev - 1 : prev + 1));
  };

  return (
    <section className="relative z-10 -mt-16 sm:-mt-20">
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,15,20,0.15)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[0_8px_20px_-8px_rgba(15,15,20,0.25)] sm:h-28 sm:w-28">
              <Image src={seller.avatar} alt={seller.name} fill className="object-cover" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A] sm:text-[30px]">
                  {seller.name}
                </h1>
                {seller.verified && (
                  <BadgeCheck size={20} className="shrink-0 text-blue-500" />
                )}
              </div>

              <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-[#64748B]">
                {seller.bio}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#475569]">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-violet-600" />
                  {seller.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-violet-600" />
                  <span className="font-[family-name:var(--font-mono)]">
                    {followerCount.toLocaleString()}
                  </span>{" "}
                  followers
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={toggleFollow}
              className={`
                flex h-11 items-center justify-center gap-1.5 rounded-xl px-5 text-[13px] font-semibold transition-colors
                ${
                  following
                    ? "border border-[#E5E7EB] text-[#64748B] hover:border-red-200 hover:text-red-500"
                    : "border border-violet-600 text-violet-700 hover:bg-violet-50"
                }
              `}
            >
              {following ? (
                <>
                  <Check size={14} />
                  Following
                </>
              ) : (
                "Follow store"
              )}
            </button>

            <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110">
              <MessageCircle size={15} />
              Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}