"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { useStore } from "@/src/hooks/use-store";
import { useStoreProducts } from "@/src/hooks/use-store-products";
import { useStoreReviews } from "@/src/hooks/use-store-reviews";
import { useAuthStore } from "@/src/store/auth-store";
import SellerCover from "./components/seller-cover";
import SellerProfile from "./components/seller-profile";
import SellerStats from "./components/seller-stats";
import SellerProducts from "./components/seller-products";
import SellerReviews from "./components/seller-review";
import SellerAbout from "./components/seller-about";
import SellerPolicies from "./components/seller-policies";
import Skeleton from "@/src/components/ui/skeleton";
import { CardGridSkeleton } from "@/src/components/skeletons/card-grid-skeleton";
import { StatTilesSkeleton } from "@/src/components/skeletons/stat-tiles-skeleton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function SellerStorePage({ params }: Props) {
  const { id: slug } = use(params);
  const authUser = useAuthStore((state) => state.user);

  const { data: store, isLoading, isError } = useStore(slug);
  const { data: productsData } = useStoreProducts(slug, { limit: 12 });
  const { data: reviewsData } = useStoreReviews(slug, { limit: 10 });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
        <Skeleton className="h-40 w-full rounded-2xl sm:h-56" />
        <div className="-mt-14 flex items-end gap-4 px-4 sm:-mt-16">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full ring-4 ring-white sm:h-28 sm:w-28" />
          <div className="flex-1 space-y-2 pb-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
        <StatTilesSkeleton count={4} />
        <CardGridSkeleton count={8} />
      </div>
    );
  }

  if (isError || !store) {
    notFound();
  }

  const products = productsData?.products ?? [];
  const reviews = reviewsData?.reviews ?? [];
  const isOwner = !!authUser && store.seller?.user.id === authUser.id;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <SellerCover store={store} />
      <SellerProfile store={store} />
      <SellerStats store={store} productCount={productsData?.total ?? 0} />

      <SellerAbout store={store} />
      <SellerPolicies store={store} />
      <SellerProducts products={products} />
      <SellerReviews
        rating={store.rating}
        reviews={reviews}
        total={reviewsData?.total ?? 0}
        isOwner={isOwner}
      />
    </div>
  );
}
