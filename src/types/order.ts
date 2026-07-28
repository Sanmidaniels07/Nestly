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
  items: OrderItem[];
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
