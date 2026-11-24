import { ShippingOption } from "./store";
import { TrafficSource } from "../lib/traffic-source";

// A guest's cart as the API prices it now.
export interface GuestCartQuoteItem {
  productId: string;
  variationId: string | null;
  quantity: number;
  // Why it can't be bought as it is (sold out, only N left, ...), or null.
  problem: string | null;
  title: string | null;
  image: string | null;
  variantLabel: string | null;
  unitPrice: number;
  maxQuantity: number;
  storeId: string | null;
}

export interface GuestCartQuoteStore {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isVerified: boolean;
  problem: string | null;
  // Delivery zones / pickup points that can carry these items.
  shippingOptions: Pick<ShippingOption, "id" | "name" | "fee" | "eta" | "type" | "areas" | "pickupAddress" | "vehicle">[];
}

export interface GuestCartQuote {
  items: GuestCartQuoteItem[];
  stores: GuestCartQuoteStore[];
  subtotal: number;
}

export interface GuestCheckoutPayload {
  items: { productId: string; variationId: string | null; quantity: number }[];
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  shippingSelections: { storeId: string; shippingOptionId: string }[];
  sellerNotes?: { storeId: string; note: string }[];
  source?: TrafficSource;
  referralCode?: string;
}

export interface GuestCheckoutResponse {
  orderId: string;
  reference: string;
  accessCode: string;
  authorizationUrl: string;
  total: number;
  guestToken: string;
}
