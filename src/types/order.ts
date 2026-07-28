import { Address } from "./address";
import { Product } from "./product";

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  storeId?: string;
  quantity: number;
  price: number;
  status?: string;
}

export interface OrderShipping {
  id: string;
  orderId: string;
  storeId: string;
  optionName: string;
  fee: number;
  etaDays?: number | null;
  createdAt: string;
}

export interface OrderTimelineEntry {
  title: string;
  description?: string;
  date: string;
  completed: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: string;
}
