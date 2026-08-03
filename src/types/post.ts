import { MediaType } from "./upload";

export interface PostAuthor {
  id: string;
  name: string;
  email?: string;
  username?: string | null;
  avatar?: string | null;
}

export interface PostMedia {
  url: string;
  type: MediaType;
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
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  media?: PostMedia[];
}

export interface PostListParams {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  sort?: "asc" | "desc";
}
