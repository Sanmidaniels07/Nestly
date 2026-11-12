import { TrafficSource } from "../lib/traffic-source";
import type { ZoneOption } from "../app/(protected)/marketplace/checkout/components/zone-picker";

// Live selling - see the API's modules/live.

export type LiveStatus = "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";

export interface LiveProduct {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  // Lowest / highest price across its options.
  price: number;
  maxPrice: number;
  // Live-only discount the seller set (percent off).
  discountPercent: number | null;
  // The discounted "from" price while the discount is on (null otherwise).
  livePrice: number | null;
  hasOptions: boolean;
  stock: number;
  available: boolean;
}

export interface LiveStore {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  city: string | null;
  state: string | null;
  isVerified: boolean;
  rating: number;
  sellerUserId: string;
}

export interface Live {
  id: string;
  code: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  scheduledAt: string;
  startedAt: string | null;
  endedAt: string | null;
  // When a running live ends by itself.
  endsAt: string | null;
  status: LiveStatus;
  endReason: string | null;
  pinnedProductId: string | null;
  discountActive: boolean;
  interestedCount: number;
  viewers: number;
  store: LiveStore;
  products: LiveProduct[];
}

export interface LiveChatMessage {
  id: string;
  text: string;
  createdAt: string;
  isSeller: boolean;
  user: { id: string; name: string; avatar: string | null };
}

// The public live page.
export interface PublicLive extends Live {
  referralCode: string | null;
  storeAddress: string | null;
  // The store's delivery zones / pickup points, for buying during the live.
  shippingOptions: ZoneOption[];
  isOwner: boolean;
  isInterested: boolean;
  isBanned: boolean;
  messages: LiveChatMessage[];
}

// A live as its seller manages it.
export interface SellerLive extends Live {
  referralCode: string | null;
  orders: number;
  revenue: number;
}

export interface MyLives {
  canGoLive: boolean;
  // What's left to set up before going live.
  blockers: string[];
  videoReady: boolean;
  maxMinutes: number;
  lives: SellerLive[];
}

export interface LiveSummary extends SellerLive {
  durationMinutes: number;
  peakViewers: number;
  chatMessages: number;
  newFollowers: number;
  signUps: number;
  topProducts: { productId: string; title: string; units: number; revenue: number }[];
}

export interface LiveListing {
  live: Live[];
  upcoming: Live[];
}

export interface LiveProductInput {
  productId: string;
  discountPercent?: number | null;
}

export interface LivePayload {
  title: string;
  description?: string | null;
  coverImage?: string | null;
  // ISO date-time; now (or just before) = go live now.
  scheduledAt: string;
  products: LiveProductInput[];
}

export interface LiveVideo {
  url: string;
  token: string;
}

export interface HostSession {
  live: SellerLive;
  video: LiveVideo;
}

/** What the seller lets buyers turn on (mics / cameras), for everyone and per person. */
export interface LiveStage {
  micsOff: boolean;
  camsOff: boolean;
  // userId -> what's switched off for just them.
  blocked: Record<string, ("microphone" | "camera")[]>;
}

export interface WatchToken extends LiveVideo {
  guest: boolean;
  stage?: LiveStage;
}

export interface BuyFromLivePayload {
  productId: string;
  variationId?: string;
  quantity?: number;
  addressId: string;
  shippingOptionId: string;
  deliveryPhone?: string;
  note?: string;
  source?: TrafficSource;
}

export interface BuyFromLiveResponse {
  orderId: string;
  reference: string;
  accessCode: string;
  authorizationUrl: string;
  unitPrice: number;
  total: number;
}
