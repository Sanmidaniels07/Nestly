import { Order } from "./order";

export interface InitiateCheckoutPayload {
  addressId: string;
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
