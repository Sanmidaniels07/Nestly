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
import Skeleton from "@/src/components/ui/skeleton";

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
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-3.5 w-64" />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr_360px]">
          <div className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="h-5 w-1/3" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          </div>

          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
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
