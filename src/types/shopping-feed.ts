import { Post } from "./post";

// GET /feed - the shopping feed: what's actually happening on Nestly.

export interface FeedProduct {
  id: string;
  title: string;
  price: number;
  image: string | null;
  store: { name: string; slug: string; logo: string | null; isVerified: boolean };
}

export interface FeedPerson {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

// FOLLOWING: someone or a store you follow. POPULAR: good activity across
// Nestly. NEAR: a store based in or delivering to your area ("Near me").
type Reason = "FOLLOWING" | "POPULAR" | "NEAR";

export interface PurchaseItem {
  type: "PURCHASE";
  id: string;
  at: string;
  reason: Reason;
  buyer: FeedPerson;
  rating: number;
  comment: string | null;
  images: string[];
  product: FeedProduct;
}

export interface DropItem {
  type: "DROP";
  id: string;
  at: string;
  reason: Reason;
  store: FeedProduct["store"];
  products: FeedProduct[];
  // How many it added that day (products shows up to 8).
  total: number;
}

export interface PostItem {
  type: "POST";
  id: string;
  at: string;
  reason: Reason;
  tagged: boolean;
  post: Post;
}

export type FeedItem = PurchaseItem | DropItem | PostItem;

export interface FeedHighlights {
  live: { code: string; title: string; coverImage: string | null; startedAt: string | null; store: { name: string; slug: string; logo: string | null } }[];
  birthdays: (FeedPerson & { inDays: number })[];
  groupGifts: {
    code: string;
    recipientName: string;
    organizer: { name: string; avatar: string | null };
    product: { title: string; image: string | null };
    target: number;
    raised: number;
    deadline: string;
  }[];
}

// The area "Near me" uses: picked, from the default address, or the profile.
export interface FeedArea {
  state: string;
  // Null = the whole state.
  area: string | null;
  label: string;
  source: "CHOSEN" | "ADDRESS" | "PROFILE";
}

export interface ShoppingFeedPage {
  items: FeedItem[];
  nextBefore: string | null;
  highlights: FeedHighlights | null;
  // "Near me" only: the area (null = none yet - ask for one) and how many stores serve it.
  area?: (FeedArea & { storeCount: number }) | null;
}
