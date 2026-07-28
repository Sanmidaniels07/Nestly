"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { useStore } from "@/src/hooks/use-store";
import { useStoreProducts } from "@/src/hooks/use-store-products";
import { useStoreReviews } from "@/src/hooks/use-store-reviews";
import SellerCover from "./components/seller-cover";
import SellerProfile from "./components/seller-profile";
import SellerStats from "./components/seller-stats";
import SellerProducts from "./components/seller-products";
import SellerReviews from "./components/seller-review";
import SellerAbout from "./components/seller-about";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function SellerStorePage({ params }: Props) {
  const { id: slug } = use(params);

  const { data: store, isLoading, isError } = useStore(slug);
  const { data: productsData } = useStoreProducts(slug, { limit: 12 });
  const { data: reviewsData } = useStoreReviews(slug, { limit: 10 });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] px-5 py-16 text-center text-[13.5px] text-[#94A3B8]">
        Loading store...
      </div>
    );
  }

  if (isError || !store) {
    notFound();
  }

  const products = productsData?.products ?? [];
  const reviews = reviewsData?.reviews ?? [];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <SellerCover store={store} />
      <SellerProfile store={store} />
      <SellerStats store={store} productCount={productsData?.total ?? 0} />

      <SellerAbout store={store} />
      <SellerProducts products={products} />
      <SellerReviews rating={store.rating} reviews={reviews} total={reviewsData?.total ?? 0} />
    </div>
  );
}
