import { Category } from "./category";

export type PaymentLinkDelivery = "DELIVERY" | "PICKUP";

export type PaymentLinkAvailability = "AVAILABLE" | "SOLD_OUT" | "PAUSED";

export interface PaymentLinkImage {
  id?: string;
  url: string;
  isPrimary: boolean;
}

// A link as its seller manages it.
export interface PaymentLink {
  id: string;
  code: string;
  title: string;
  description: string;
  price: number;
  // Still available to buy through the link.
  quantity: number;
  images: PaymentLinkImage[];
  category: Pick<Category, "id" | "name" | "slug">;
  deliveryType: PaymentLinkDelivery;
  deliveryFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sales: { orders: number; units: number; revenue: number };
}

export interface PaymentLinkPayload {
  title: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: string;
  images?: { url: string; isPrimary?: boolean }[];
  deliveryType: PaymentLinkDelivery;
  deliveryFee?: number;
}

export type UpdatePaymentLinkPayload = Partial<PaymentLinkPayload> & { isActive?: boolean };

// A link as the buyer sees it on /pay/{code}.
export interface PublicPaymentLink {
  code: string;
  title: string;
  description: string;
  price: number;
  images: { url: string; isPrimary: boolean }[];
  category: Pick<Category, "id" | "name" | "slug">;
  quantityAvailable: number;
  deliveryType: PaymentLinkDelivery;
  deliveryFee: number;
  pickupAddress: string | null;
  availability: PaymentLinkAvailability;
  isOwner: boolean;
  store: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    city: string | null;
    state: string | null;
    isVerified: boolean;
    rating: number;
    sellerUserId: string;
  };
  createdAt: string;
}

export interface PayPaymentLinkPayload {
  quantity: number;
  addressId: string;
  deliveryPhone?: string;
  note?: string;
}

export interface PayPaymentLinkResponse {
  orderId: string;
  reference: string;
  accessCode: string;
  authorizationUrl: string;
  total: number;
}
