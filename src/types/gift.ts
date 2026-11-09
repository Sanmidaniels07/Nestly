export type GiftStatus = "UNPAID" | "SENT" | "CLAIMED" | "DECLINED" | "EXPIRED" | "CANCELLED";

export interface GiftPerson {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

/** GET /gifts/:code - what the gift page shows, depending on who's looking. */
export interface Gift {
  code: string;
  status: GiftStatus;
  role: "SENDER" | "RECIPIENT" | "VIEWER";
  canClaim: boolean;
  forSomeoneElse: boolean;
  sender: GiftPerson;
  recipientName: string;
  hasNamedRecipient: boolean;
  message: string | null;
  showPrice: boolean;
  expiresAt: string | null;
  claimedAt: string | null;
  item: {
    title: string | null;
    image: string | null;
    variantLabel: string | null;
    quantity: number;
    productId: string;
    unitPrice: number | null;
  } | null;
  store: { name: string; slug: string; logo: string | null } | null;
  delivery: {
    type: "DELIVERY" | "PICKUP";
    optionName: string;
    eta: string | null;
    pickupAddress: string | null;
    state: string | null;
    areas: string[];
  } | null;
  payment: { total: number; orderId: string; refundStatus: "REQUESTED" | "FAILED" | null } | null;
  progress: {
    orderItemId: string;
    itemStatus: string;
    shippedAt: string | null;
    deliveredAt: string | null;
    deliveryConfirmedAt: string | null;
    deliveryCode: string | null;
    deliverTo: { fullName: string; address: string; city: string; state: string } | null;
    deliveryPhone: string | null;
  } | null;
  senderProgress: { itemStatus: string; shippedAt: string | null; deliveredAt: string | null } | null;
}

export interface SendGiftPayload {
  productId: string;
  variationId?: string;
  quantity?: number;
  shippingOptionId: string;
  recipientId?: string;
  recipientName: string;
  message?: string;
  showPrice?: boolean;
  source?: string;
}

export interface SendGiftResponse {
  code: string;
  orderId: string;
  reference: string;
  accessCode: string;
  authorizationUrl: string;
  total: number;
}

export interface ClaimGiftPayload {
  addressId?: string;
  deliveryPhone?: string;
}
