"use client";

import SectionHeader from "../components/section-header";
import SellerCard from "../seller/components/sellers-card";
import { useStores } from "@/src/hooks/use-stores";

export default function TrendingSellers() {
  const { data } = useStores({ limit: 6 });
  const stores = data?.stores ?? [];

  if (stores.length === 0) return null;

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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stores.map((store) => (
          <SellerCard key={store.id} seller={store} />
        ))}
      </div>
    </section>
  );
}
