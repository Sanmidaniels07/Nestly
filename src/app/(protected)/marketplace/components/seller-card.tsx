"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Star, Store } from "lucide-react";

import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerCard({ seller }: Props) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2.5px]">
          <div className="rounded-full bg-surface p-[2.5px]">
            <Image
              src={seller.avatar}
              alt={seller.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[15px] font-semibold text-ink">
              {seller.name}
            </h3>
            {seller.verified && <BadgeCheck size={16} className="shrink-0 text-blue-500" />}
          </div>

          <div className="mt-1 flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium text-ink">
              {seller.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-4 text-[13px] text-muted">
        <span className="font-[family-name:var(--font-mono)]">
          {seller.productsCount} products
        </span>

        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span className="font-[family-name:var(--font-mono)]">{seller.distance}</span>
        </div>
      </div>

      <Link
        href={`/marketplace/seller/${seller.id}`}
        className="
          mt-5 flex items-center justify-center gap-2 rounded-xl
          bg-gradient-to-r from-violet-600 to-indigo-600
          py-2.5 text-[13.5px] font-semibold text-white
          transition-all hover:brightness-110
        "
      >
        <Store size={15} />
        Visit store
      </Link>
    </motion.article>
  );
}