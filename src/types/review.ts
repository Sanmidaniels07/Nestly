import { PostAuthor } from "./post";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  storeId?: string;
  user?: PostAuthor;
  productTitle?: string;
  rating: number;
  comment?: string | null;
  reply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}
