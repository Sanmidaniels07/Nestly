import { Order } from "./order";

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
}

export interface InitiateCheckoutResponse {
  order: Order;
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface VerifyCheckoutResponse {
  order: Order;
  status: string;
}

export interface ChargeSavedCardPayload {
  addressId: string;
  savedCardId: string;
  shippingSelections?: ShippingSelection[];
  couponCode?: string;
  sellerNotes?: SellerNote[];
}
