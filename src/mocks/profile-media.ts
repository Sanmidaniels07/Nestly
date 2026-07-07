export interface ProfileMedia {
  id: string;
  type: "photo" | "video";
  image: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export const profileMedia: ProfileMedia[] = [
  {
    id: "1",
    type: "photo",
    image: "/images/feed/feed1.jpg",
    likes: 421,
    comments: 48,
    createdAt: "2d",
  },
  {
    id: "2",
    type: "photo",
    image: "/images/feed/feed2.jpg",
    likes: 892,
    comments: 61,
    createdAt: "5d",
  },
  {
    id: "3",
    type: "video",
    image: "/images/feed/feed3.jpg",
    likes: 215,
    comments: 13,
    createdAt: "1w",
  },
  {
    id: "4",
    type: "photo",
    image: "/images/feed/feed4.jpg",
    likes: 654,
    comments: 92,
    createdAt: "2w",
  },
  {
    id: "5",
    type: "photo",
    image: "/images/feed/feed5.jpg",
    likes: 1012,
    comments: 123,
    createdAt: "3w",
  },
  {
    id: "6",
    type: "video",
    image: "/images/feed/feed6.jpg",
    likes: 301,
    comments: 17,
    createdAt: "1m",
  },
];