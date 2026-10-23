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
  // Written before the seller turned the listing into a different product.
  earlierVersion?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Rating figures cover current-version reviews only.
export interface ReviewSummary {
  averageRating: number;
  ratingCount: number;
  earlierVersionCount: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}
