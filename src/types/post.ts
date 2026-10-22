import { MediaType } from "./upload";

export interface PostAuthor {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
}

export interface PostMedia {
  url: string;
  type: MediaType;
}

/** A product the author tagged in their post (only shown while on sale). */
export interface PostProduct {
  id: string;
  title: string;
  price: number;
  image: string | null;
  store: { name: string; slug: string };
}

export interface Post {
  id: string;
  // A post only needs text content, at least one image/video, or both —
  // either can be null for a media-only or (rarer) title-only post.
  title: string | null;
  content: string | null;
  authorId: string;
  author?: PostAuthor;
  isDeleted?: boolean;
  media?: PostMedia[];
  hashtags?: string[];
  likeCount?: number;
  likedByMe?: boolean;
  product?: PostProduct | null;
  // GET /hashtags/:tag/posts serializes posts slightly differently and
  // includes this instead of `likeCount` — fall back to it when present.
  _count?: { likes: number };
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostPayload {
  title?: string;
  content?: string;
  media?: PostMedia[];
  productId?: string;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  media?: PostMedia[];
  /** null removes the tag. */
  productId?: string | null;
}

export interface PostListParams {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  sort?: "asc" | "desc";
}
