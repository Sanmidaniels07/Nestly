export interface PostAuthor {
  id: string;
  name: string;
  email?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: PostAuthor;
  isDeleted?: boolean;
  likeCount?: number;
  likedByMe?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
}

export interface PostListParams {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  sort?: "asc" | "desc";
}
