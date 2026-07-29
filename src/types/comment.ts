import { PostAuthor } from "./post";

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  user?: PostAuthor;
  createdAt: string;
  updatedAt: string;
}
