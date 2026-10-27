import { Address } from "./address";
import { Product } from "./product";

export type DeliveryConfirmation = "CODE" | "BUYER" | "AUTO";

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  storeId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  /** Commission % locked onto this item at checkout (used in the seller's earnings breakdown). */
  commissionRate?: number;
  status?: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  deliveryConfirmedAt?: string | null;
  deliveryConfirmedBy?: DeliveryConfirmation | null;
  // Buyer-facing only: delivered by the seller but not yet confirmed.
  awaitingConfirmation?: boolean;
  returnWindowEndsAt?: string | null;
  returnWindowOpen?: boolean;
  // The listing as it was when ordered (product.title/images already show it).
  productTitle?: string | null;
  productImage?: string | null;
  productDescription?: string | null;
  productBrand?: string | null;
  productCondition?: string | null;
  productSku?: string | null;
  productHighlights?: string[];
  productSpecs?: { name: string; value: string }[] | null;
  // The buyer's choice for products with options, e.g. "Size: Large · Flavour: Vanilla".
  variantLabel?: string | null;
  variationId?: string | null;
  // Buyer-facing only: the seller has edited the listing since this order.
  listingChanged?: boolean;
}

export interface OrderShipping {
  id: string;
  orderId: string;
  storeId: string;
  optionName: string;
  fee: number;
  eta?: string | null;
  // PICKUP: the buyer collects from the seller at pickupAddress (always free).
  type?: "DELIVERY" | "PICKUP";
  pickupAddress?: string | null;
  vehicle?: "BIKE" | "CAR" | "TRUCK" | null;
  // Only ever present on the buyer's own order.
  deliveryCode?: string | null;
  createdAt: string;
}

export type OrderEventType =
  | "PLACED"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CONFIRMED"
  | "CANCELLED"
  | "PROBLEM_REPORTED";

export interface OrderEvent {
  id: string;
  orderItemId: string | null;
  type: OrderEventType;
  actor: "BUYER" | "SELLER" | "SYSTEM";
  note: string | null;
  createdAt: string;
}

export interface OrderTimelineEntry {
  step: string;
  completed: boolean;
  current: boolean;
  at: string | null;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  discountAmount?: number;
  couponCode?: string | null;
  trackingNumber?: string | null;
  items: OrderItem[];
  shipping?: OrderShipping[];
  // Buyer's notes to sellers. Sellers only get their own store's (no storeId).
  sellerNotes?: { storeId?: string; note: string }[];
  // Sellers get the delivery address without the buyer's phone - they
  // message the buyer in the app.
  address?: Address;
  /** Sellers only: the buyer (no email or phone). */
  user?: { id: string; name: string };
  /** Number to call to deliver. Sellers get it only for delivery orders until delivered. */
  deliveryPhone?: string | null;
  paymentReference?: string;
  paymentMethod?: string;
  timeline?: OrderTimelineEntry[];
  events?: OrderEvent[];
  /** Set when Nestly cancelled a paid order because the item sold out first. */
  cancelReason?: string | null;
  /** That order's automatic refund: REQUESTED, or FAILED (the team refunds by hand). */
  refundStatus?: "REQUESTED" | "FAILED" | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: string;
}
