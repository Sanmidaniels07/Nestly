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

// FOLLOWING: someone or a store you follow. POPULAR: good activity across Nestly.
type Reason = "FOLLOWING" | "POPULAR";

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

export interface ShoppingFeedPage {
  items: FeedItem[];
  nextBefore: string | null;
  highlights: FeedHighlights | null;
}
