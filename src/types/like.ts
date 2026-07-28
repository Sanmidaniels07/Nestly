import { PostAuthor } from "./post";

export interface Like {
  id: string;
  postId: string;
  userId: string;
  user?: PostAuthor;
  createdAt: string;
}
