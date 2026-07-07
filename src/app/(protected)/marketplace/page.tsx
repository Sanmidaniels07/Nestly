"use client";

import MarketplaceHero from "./components/hero";
import CategoriesSection from "./sections/categories";
import NearbyProducts from "./sections/nearby-products";
import TrendingSellers from "./sections/trending-sellers";


export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-6">
      <MarketplaceHero />
      <CategoriesSection />
       <NearbyProducts />
       <TrendingSellers />
    </div>
  );
}