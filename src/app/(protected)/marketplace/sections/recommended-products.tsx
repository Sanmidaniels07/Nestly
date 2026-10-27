"use client";

import ProductSection from "./product-section";
import {
  useBestSellers,
  useForYou,
  useRecentlyViewed,
  useTrendingProducts,
} from "@/src/hooks/use-recommendations";
import { RecommendationReason } from "@/src/types/product";

const REASON_LABELS: Record<RecommendationReason, string> = {
  FOLLOWED_STORE: "From a store you follow",
  SIMILAR: "Based on your activity",
  POPULAR: "Popular on Nestly",
  NEW: "New arrival",
};

export function ForYouProducts() {
  const { data, isLoading } = useForYou(8);

  return (
    <ProductSection
      title="Picked for you"
      subtitle="Based on what you like"
      products={data}
      isLoading={isLoading}
      badge={(product) => (product.reason ? REASON_LABELS[product.reason] : undefined)}
    />
  );
}

export function TrendingProducts() {
  const { data, isLoading } = useTrendingProducts(4);

  return (
    <ProductSection
      title="Trending now"
      subtitle="What buyers are loving"
      products={data}
      isLoading={isLoading}
      badge={() => "Trending"}
    />
  );
}

export function BestSellers() {
  const { data, isLoading } = useBestSellers(4);

  return (
    <ProductSection
      title="Best sellers"
      subtitle="Most bought on Nestly"
      products={data}
      isLoading={isLoading}
      badge={(product) => (product.soldCount ? `${product.soldCount} sold` : undefined)}
    />
  );
}

export function RecentlyViewedProducts() {
  const { data, isLoading } = useRecentlyViewed(4);

  return (
    <ProductSection
      title="Recently viewed"
      subtitle="Pick up where you left off"
      products={data}
      isLoading={isLoading}
    />
  );
}
