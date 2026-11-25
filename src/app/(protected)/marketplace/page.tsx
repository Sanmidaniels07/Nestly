"use client";

import MarketplaceHero from "./components/hero";
import CategoriesSection from "./sections/categories";
import NearbyProducts from "./sections/nearby-products";
import {
  BestSellers,
  ForYouProducts,
  RecentlyViewedProducts,
  TrendingProducts,
} from "./sections/recommended-products";
import TrendingSellers from "./sections/trending-sellers";
import SellCta from "./sections/sell-cta";
import LiveStrip from "@/src/components/live/live-strip";
import ShopTabs from "@/src/components/layout/shop-tabs";
import Greeting from "./components/greeting";

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 pb-20 pt-4 sm:space-y-14 sm:pt-6">
      <div className="-mb-6 flex flex-wrap items-center justify-between gap-3 sm:-mb-8">
        <Greeting />
        <ShopTabs />
      </div>
      <MarketplaceHero />
      <LiveStrip />
      <CategoriesSection />
      <ForYouProducts />
      <TrendingProducts />
      <BestSellers />
      <NearbyProducts />
      <RecentlyViewedProducts />
      <TrendingSellers />
      <SellCta />
    </div>
  );
}
