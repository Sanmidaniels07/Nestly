"use client";

import { MarketplaceItem } from "@/src/mocks/profile-marketplace";
import ProfileMarketCard from "./profile-marketplace-card";

interface Props {
  title: string;
  subtitle: string;
  items: MarketplaceItem[];
}

export default function ProfileMarketSection({ title, subtitle, items }: Props) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
          {title}
        </h2>
        <p className="text-[13.5px] text-[#94A3B8]">{subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ProfileMarketCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}