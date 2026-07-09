"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { nearbyProducts, trendingSellers } from "@/src/mocks/marketplace";
import SellerCover from "./components/seller-cover";
import SellerProfile from "./components/seller-profile";
import SellerStats from "./components/seller-stats";
import SellerProducts from "./components/seller-products";
import SellerReviews from "./components/seller-review";
import SellerPolicies from "./components/seller-policies";
import SellerAbout from "./components/seller-about";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function SellerStorePage({ params }: Props) {
  const { id } = use(params);

  const seller = trendingSellers.find((seller) => seller.id === id);

  if (!seller) {
    notFound();
  }

  const products = nearbyProducts.filter((product) => product.seller.id === seller.id);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <SellerCover seller={seller} />
      <SellerProfile seller={seller} />
      <SellerStats seller={seller} />

      <SellerAbout seller={seller} />
      <SellerProducts products={products} />
      <SellerReviews seller={seller} />
      <SellerPolicies seller={seller} />
    </div>
  );
}