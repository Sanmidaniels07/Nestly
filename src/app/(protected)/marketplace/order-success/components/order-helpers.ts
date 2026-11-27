import { Order, OrderItem, OrderShipping } from "@/src/types/order";
import { ProductStoreSummary } from "@/src/types/product";

export const money = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

export interface Shop {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
  sellerUserId?: string;
  items: OrderItem[];
  shipping?: OrderShipping;
}

// The order split by shop, in the order the items appear.
export function shopsIn(order: Order): Shop[] {
  const shops = new Map<string, Shop>();
  for (const item of order.items) {
    if (item.status === "CANCELLED") continue;
    const store: Partial<ProductStoreSummary> = item.product?.store ?? {};
    const id = store.id ?? item.storeId ?? "seller";
    if (!shops.has(id)) {
      shops.set(id, {
        id,
        name: store.name ?? "Seller",
        slug: store.slug,
        logo: store.logo,
        sellerUserId: store.sellerUserId,
        items: [],
        shipping: order.shipping?.find((shipment) => shipment.storeId === id),
      });
    }
    shops.get(id)!.items.push(item);
  }
  return [...shops.values()];
}

export const isPickupOrder = (order: Order) => (order.shipping ?? []).length > 0 && (order.shipping ?? []).every((shipment) => shipment.type === "PICKUP");

export const hasPerishable = (order: Order) => order.items.some((item) => item.perishable);
