// Chip in on a gift: friends each pay part of one gift.
export type GroupGiftStatus = "OPEN" | "FUNDED" | "CANCELLED" | "EXPIRED" | "FAILED";

export interface GroupGiftPerson {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

export interface GroupGiftView {
  code: string;
  status: GroupGiftStatus;
  surprise: false;
  recipientName: string;
  recipient: GroupGiftPerson | null;
  organizer: GroupGiftPerson;
  message: string | null;
  product: { id: string; title: string; image: string | null };
  store: { name: string; slug: string; isVerified: boolean };
  // Naira.
  target: number;
  raised: number;
  remaining: number;
  deadline: string;
  closedAt: string | null;
  minContribution: number;
  // Names (null when hidden) and messages - no amounts.
  contributors: { name: string | null; avatar: string | null; message: string | null; at: string | null }[];
  myContribution: number | null;
  isOrganizer: boolean;
  // The organiser, once funded: the gift that was placed.
  giftCode: string | null;
  createdAt: string;
}

// The recipient, while it's open: only that something is coming.
export interface GroupGiftSurprise {
  code: string;
  status: GroupGiftStatus;
  surprise: true;
  recipientName: string;
}

export type GroupGift = GroupGiftView | GroupGiftSurprise;

export interface StartGroupGiftPayload {
  productId: string;
  variationId?: string;
  shippingOptionId: string;
  recipientId?: string;
  recipientName: string;
  message?: string;
  deadline: string;
}

export interface ContributePayload {
  amount: number;
  message?: string;
  hideName?: boolean;
}

export interface ContributionPayment {
  reference: string;
  accessCode: string;
  authorizationUrl: string;
  amount: number;
}
