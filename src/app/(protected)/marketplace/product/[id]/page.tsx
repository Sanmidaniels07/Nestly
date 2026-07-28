"use client";

import { use } from "react";

import { useProduct } from "@/src/hooks/use-product";
import { useRelatedProducts } from "@/src/hooks/use-related-products";
import { useProductReviews } from "@/src/hooks/use-product-reviews";
import ProductBreadcrumb from "./components/breadcrumb";
import ProductGallery from "./components/product-gallery";
import ProductInfo from "./components/product-info";
import BuyBox from "./components/buy-box";
import SellerSummary from "./components/seller-summary";
import ProductSpecifications from "./components/product-specifications";
import ProductDescription from "./components/product-description";
import ProductReviews from "./components/product-reviews";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: Props) {
  const { id } = use(params);

  const { data: product, isLoading, isError } = useProduct(id);
  useRelatedProducts(id, 8);
  const { data: reviewsData } = useProductReviews(id, { limit: 20 });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-[14px] text-[#94A3B8]">
        Loading product...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-[15px] font-medium text-[#13131A]">
          Product not found
        </p>
        <p className="mt-1 text-[14px] text-[#64748B]">
          This listing may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ProductBreadcrumb product={product} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr_360px]">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
        <BuyBox product={product} />
      </div>

      {product.store && <SellerSummary store={product.store} />}

      <ProductDescription product={product} />
      <ProductSpecifications product={product} />
      <ProductReviews product={product} reviews={reviewsData?.reviews ?? []} total={reviewsData?.total ?? 0} />
    </div>
  );
}
