"use client";

import SectionHeader from "../components/section-header";
import SellerCard from "../components/seller-card";
import { trendingSellers } from "@/src/mocks/marketplace";

export default function TrendingSellers() {
  return (
    <section className="space-y-6">
      <SectionHeader title="Trending sellers" subtitle="Trusted stores"  action={{
          label: "View all",
          href: "/marketplace/seller",
        }}/>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {trendingSellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  );
}