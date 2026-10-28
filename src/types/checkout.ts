import { Order } from "./order";
import { TrafficSource } from "../lib/traffic-source";

export interface ShippingSelection {
  storeId: string;
  shippingOptionId: string;
}

export interface SellerNote {
  storeId: string;
  note: string;
}

export interface InitiateCheckoutPayload {
  addressId: string;
  shippingSelections?: ShippingSelection[];
  couponCode?: string;
  sellerNotes?: SellerNote[];
  /** Number the seller calls to deliver; defaults to the address's phone. */
  deliveryPhone?: string;
  /** Where the visitor came from (admin overview). */
  source?: TrafficSource;
}

export interface InitiateCheckoutResponse {
  order: Order;
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface ChargeSavedCardPayload {
  addressId: string;
  savedCardId: string;
  shippingSelections?: ShippingSelection[];
  couponCode?: string;
  sellerNotes?: SellerNote[];
  /** Number the seller calls to deliver; defaults to the address's phone. */
  deliveryPhone?: string;
  /** Where the visitor came from (admin overview). */
  source?: TrafficSource;
}
