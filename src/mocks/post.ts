export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export const posts = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Daniel Sanmi",
      avatar:
        "https://i.pravatar.cc/150?img=1",
    },
    content:
      "Building Nestly today 🚀 Excited for what's coming.",

    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",

    likes: 245,
    comments: 32,
    createdAt: "2h ago",
  },

  {
    id: "2",
    user: {
      id: "2",
      name: "Sarah Johnson",
      avatar:
        "https://i.pravatar.cc/150?img=5",
    },
    content:
      "Nothing beats shipping features with a great team.",

    likes: 89,
    comments: 12,
    createdAt: "5h ago",
  },
];