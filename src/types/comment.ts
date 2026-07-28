import { PostAuthor } from "./post";

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author?: PostAuthor;
  createdAt: string;
  updatedAt: string;
}
