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
  address?: Address;
  paymentReference?: string;
  paymentMethod?: string;
  timeline?: OrderTimelineEntry[];
  events?: OrderEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: string;
}
