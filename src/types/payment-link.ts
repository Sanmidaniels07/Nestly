import { TrafficSource } from "../lib/traffic-source";
import { Order } from "./order";
import { User } from "./auth";

import { Category } from "./category";
import { ShippingOption } from "./store";
import { DeliveryVehicle } from "../lib/delivery-vehicle";

// DELIVERY: the seller delivers for the link's fee. PICKUP: from the store.
// STORE_OPTIONS: the buyer picks one of the store's zones / pickup points.
export type PaymentLinkDelivery = "DELIVERY" | "PICKUP" | "STORE_OPTIONS";

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
  deliveryVehicle: DeliveryVehicle;
  isActive: boolean;
  // Shared from a product in the shop ("Share pay link"): title, price,
  // photos and stock are the listing's - only delivery is edited here.
  fromListing: boolean;
  productId: string | null;
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
  deliveryVehicle?: DeliveryVehicle;
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
  // Shared from a product in the shop - the listing, for "See it in the shop".
  productId?: string | null;
  quantityAvailable: number;
  deliveryType: PaymentLinkDelivery;
  deliveryFee: number;
  pickupAddress: string | null;
  deliveryVehicle: DeliveryVehicle;
  // STORE_OPTIONS: the zones / pickup points the buyer chooses from.
  shippingOptions: Pick<ShippingOption, "id" | "name" | "fee" | "eta" | "type" | "areas" | "state" | "pickupAddress" | "vehicle">[];
  availability: PaymentLinkAvailability;
  isOwner: boolean;
  // From an accepted offer in chat: only that buyer can pay it.
  reserved?: boolean;
  reservedForViewer?: boolean;
  store: {
    id: string;
    name: string;
    slug: string;
    address: string | null;
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
  shippingOptionId?: string;
  deliveryPhone?: string;
  /** Where the visitor came from (admin overview). */
  source?: TrafficSource;
  note?: string;
}

export interface PayPaymentLinkResponse {
  orderId: string;
  reference: string;
  accessCode: string;
  authorizationUrl: string;
  total: number;
}

// Guest checkout: paying without an account. Who they are and where it
// goes replace the saved address a logged-in buyer picks.
export interface GuestPayPaymentLinkPayload {
  name: string;
  email: string;
  phone: string;
  // Not needed when the buyer picks it up.
  address?: string;
  city?: string;
  state?: string;
  quantity: number;
  shippingOptionId?: string;
  note?: string;
  source?: TrafficSource;
  // The store's ?ref= code, as at signup.
  referralCode?: string;
}

export interface GuestPayPaymentLinkResponse extends PayPaymentLinkResponse {
  // Secret for the private tracking page /orders/track/{guestToken}.
  guestToken: string;
}

// The guest's order on /orders/track/{token}: the usual order view plus
// the seller and whether the guest account has been set up yet.
export interface GuestOrder extends Order {
  store: { name: string; slug: string; logo: string | null; isVerified: boolean; sellerUserId: string } | null;
  paymentLinkCode: string | null;
  buyer: { name: string; email: string; isGuest: boolean };
}

export type ClaimGuestAccountResponse =
  | { emailSent: true; email: string }
  | { emailSent: false; accessToken: string; user: User };
