"use client";

import { marketplaceItems, MarketplaceItem } from "@/src/mocks/profile-marketplace";
import ProfileMarketSummary from "../components/profile-market-summary";
import ProfileMarketSection from "../components/profile-market-section";
import ProfileMarketEmpty from "../components/profile-market-empty";

export default function ProfileMarketplace() {
  const activeListings: MarketplaceItem[] = marketplaceItems.filter(
    (item) => item.status === "ACTIVE"
  );
  const soldItems: MarketplaceItem[] = marketplaceItems.filter(
    (item) => item.status === "SOLD"
  );
  const purchasedItems: MarketplaceItem[] = marketplaceItems.filter(
    (item) => item.status === "PURCHASED"
  );

  if (!marketplaceItems.length) {
    return <ProfileMarketEmpty />;
  }

  return (
    <div className="space-y-10">
      <ProfileMarketSummary />

      <ProfileMarketSection
        title="Current listings"
        subtitle="Items currently available for sale."
        items={activeListings}
      />
      <ProfileMarketSection
        title="Recently sold"
        subtitle="Products successfully sold."
        items={soldItems}
      />
      <ProfileMarketSection
        title="Recent purchases"
        subtitle="Products recently purchased."
        items={purchasedItems}
      />
    </div>
  );
}