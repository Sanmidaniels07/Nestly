"use client";

import { useMemo } from "react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { useSellerOrders } from "@/src/hooks/use-seller-orders";
import { useOrders } from "@/src/hooks/use-orders";
import { formatRelativeTime } from "@/src/lib/date";
import { Order, OrderItem } from "@/src/types/order";
import { Product } from "@/src/types/product";
import ProfileMarketSummary from "../components/profile-market-summary";
import ProfileMarketSection from "../components/profile-market-section";
import ProfileMarketEmpty from "../components/profile-market-empty";
import { MarketCardItem } from "../components/profile-marketplace-card";

function primaryImage(product: { images: { url: string; isPrimary?: boolean }[] }) {
  return product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url;
}

function productToItem(product: Product): MarketCardItem {
  const location = [product.store?.city, product.store?.state].filter(Boolean).join(", ");

  return {
    id: product.id,
    title: product.title,
    image: primaryImage(product),
    price: product.price,
    status: "ACTIVE",
    location: location || undefined,
    meta:
      product.rating !== undefined
        ? `${product.rating.toFixed(1)} ★${
            product.reviewCount ? ` · ${product.reviewCount} review${product.reviewCount === 1 ? "" : "s"}` : ""
          }`
        : undefined,
    href: `/marketplace/product/${product.id}`,
  };
}

function orderItemToItem(
  order: Order,
  item: OrderItem,
  status: "SOLD" | "PURCHASED"
): MarketCardItem {
  return {
    id: `${order.id}-${item.id}`,
    title: item.product.title,
    image: primaryImage(item.product),
    price: item.price,
    status,
    meta: `Qty ${item.quantity} · ${formatRelativeTime(order.createdAt)}`,
    href:
      status === "PURCHASED"
        ? `/marketplace/orders/${order.id}`
        : `/marketplace/product/${item.productId}`,
  };
}

export default function ProfileMarketplace() {
  const { data: seller, isLoading: isLoadingSeller } = useMySeller();
  const hasStore = !!seller?.store;

  const { data: productsData, isLoading: isLoadingProducts } = useMyProducts(
    { status: "PUBLISHED", limit: 12 },
    { enabled: hasStore }
  );
  const { data: sellerOrdersData, isLoading: isLoadingSellerOrders } = useSellerOrders(
    { limit: 20 },
    { enabled: hasStore }
  );
  const { data: myOrdersData, isLoading: isLoadingMyOrders } = useOrders({ limit: 20 });

  const activeListings = useMemo<MarketCardItem[]>(
    () => (productsData?.products ?? []).map(productToItem),
    [productsData]
  );

  const soldItems = useMemo<MarketCardItem[]>(() => {
    const orders = sellerOrdersData?.orders ?? [];
    return orders.flatMap((order) =>
      order.items.map((item) => orderItemToItem(order, item, "SOLD"))
    );
  }, [sellerOrdersData]);

  const purchasedItems = useMemo<MarketCardItem[]>(() => {
    const orders = myOrdersData?.orders ?? [];
    return orders.flatMap((order) =>
      order.items.map((item) => orderItemToItem(order, item, "PURCHASED"))
    );
  }, [myOrdersData]);

  const isLoading =
    isLoadingSeller ||
    (hasStore && (isLoadingProducts || isLoadingSellerOrders)) ||
    isLoadingMyOrders;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-10 text-center text-[14px] text-[#94A3B8]">
        Loading marketplace activity...
      </div>
    );
  }

  const hasAnyActivity =
    activeListings.length > 0 || soldItems.length > 0 || purchasedItems.length > 0;

  if (!hasAnyActivity) {
    return <ProfileMarketEmpty hasStore={hasStore} />;
  }

  return (
    <div className="space-y-10">
      <ProfileMarketSummary
        activeCount={hasStore ? productsData?.total ?? 0 : 0}
        soldCount={hasStore ? soldItems.length : 0}
        purchaseCount={purchasedItems.length}
        rating={hasStore ? seller?.store?.rating : undefined}
      />

      {hasStore && (
        <ProfileMarketSection
          title="Current listings"
          subtitle="Items currently available for sale."
          items={activeListings}
        />
      )}
      {hasStore && (
        <ProfileMarketSection
          title="Recently sold"
          subtitle="Products successfully sold."
          items={soldItems}
        />
      )}
      <ProfileMarketSection
        title="Recent purchases"
        subtitle="Products recently purchased."
        items={purchasedItems}
      />
    </div>
  );
}
