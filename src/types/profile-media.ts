export interface ProfileMedia {
  id: string;
  type: "photo" | "video";
  image: string;
  likes: number;
  comments: number;
  createdAt: string;
}
