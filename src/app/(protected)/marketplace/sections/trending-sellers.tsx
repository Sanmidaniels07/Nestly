"use client";

import SectionHeader from "../components/section-header";
import SellerCard from "../seller/components/sellers-card";
import { useStores } from "@/src/hooks/use-stores";

export default function TrendingSellers() {
  // Ranked by store views, then followers - only stores with live products.
  const { data, isLoading } = useStores({ limit: 6, sort: "trending" });
  const stores = data?.stores ?? [];

  if (!isLoading && stores.length === 0) return null;

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Trending sellers"
        subtitle="Trusted stores"
        action={{
          label: "View all",
          href: "/marketplace/seller",
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[380px] animate-pulse rounded-3xl border border-line bg-surface-2" />
            ))
          : stores.map((store, index) => (
              <SellerCard key={store.id} seller={store} rank={index + 1} />
            ))}
      </div>
    </section>
  );
}
