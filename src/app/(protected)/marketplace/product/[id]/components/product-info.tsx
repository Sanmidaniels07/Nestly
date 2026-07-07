"use client";

import { MarketplaceProduct } from "@/src/mocks/marketplace";
import RatingSection from "./product-info-components/rating-section";
import PriceSection from "./product-info-components/product-price";
import AvailabilityBadges from "./product-info-components/availability.badges";
import ProductHighlights from "./product-info-components/products-highlights";
import DeliverySummary from "./product-info-components/delivery-summary";

interface Props {
  product: MarketplaceProduct;
}

export default function ProductInfo({ product }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12.5px] uppercase tracking-widest text-violet-600">
          {product.brand}
        </p>

        <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[32px] italic leading-tight text-[#13131A] sm:text-[36px]">
          {product.name}
        </h1>

        <div className="mt-4">
          <RatingSection product={product} />
        </div>
      </div>

      <div className="border-t border-[#F2F1F8] pt-6">
        <PriceSection product={product} />
      </div>

      <AvailabilityBadges product={product} />

      <div className="border-t border-[#F2F1F8] pt-6">
        <ProductHighlights product={product} />
      </div>

      <DeliverySummary product={product} />
    </div>
  );
}