"use client";

import MarketplaceHero from "./components/hero";
import CategoriesSection from "./sections/categories";
import NearbyProducts from "./sections/nearby-products";
import TrendingSellers from "./sections/trending-sellers";
import SellCta from "./sections/sell-cta";

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 pb-20 pt-6 sm:space-y-14">
      <MarketplaceHero />
      <CategoriesSection />
      <NearbyProducts />
      <TrendingSellers />
      <SellCta />
    </div>
  );
}
