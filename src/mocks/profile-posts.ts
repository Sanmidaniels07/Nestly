export interface ProfilePost {
  id: string;
  content: string;
  createdAt: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  pinned?: boolean;
}

export const profilePosts: ProfilePost[] = [
  {
    id: "1",
    pinned: true,
    createdAt: "2 days ago",
    content:
      "Excited to finally begin building Nestly 🚀. This has been months in the making and I can't wait to share the journey.",
    likes: 254,
    comments: 38,
    shares: 14,
    views: 3200,
    images: [
      "/images/posts/post1.jpg",
    ],
  },
  {
    id: "2",
    createdAt: "1 week ago",
    content:
      "Spent today improving the Profile UI. Little details make all the difference.",
    likes: 102,
    comments: 12,
    shares: 4,
    views: 1200,
  },
];