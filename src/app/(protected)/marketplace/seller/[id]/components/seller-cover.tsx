"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerCover({ seller }: Props) {
  return (
    <section className="relative h-[220px] overflow-hidden rounded-2xl sm:h-[260px]">
      <Image src={seller.coverImage} alt={seller.name} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

      <Link
        href="/marketplace/seller"
        className="absolute left-5 top-5 flex h-10 items-center gap-2 rounded-xl bg-white/90 px-4 text-[13px] font-semibold text-[#334155] backdrop-blur-sm transition-colors hover:bg-white"
      >
        <ArrowLeft size={15} />
        Back to sellers
      </Link>
    </section>
  );
}