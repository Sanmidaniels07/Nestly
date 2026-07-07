export interface Profile {
  id: string;

  name: string;

  username: string;

  bio: string;

  avatar: string;

  cover: string;

  verified: boolean;

  followers: number;

  following: number;

  posts: number;

  listings: number;

  location: string;

  website: string;

  joined: string;

  github?: string;

  linkedin?: string;

  twitter?: string;

  instagram?: string;
}

export const profile: Profile = {
  id: "1",

  name: "Daniel Sanmi",

  username: "daniel",

  bio:
    "Frontend Engineer • Building Nestly • Passionate about creating meaningful social experiences.",

  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",

  cover:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",

  verified: true,

  followers: 1832,

  following: 345,

  posts: 68,

  listings: 12,

  location: "Lagos, Nigeria",

  website: "https://nestly.app",

  joined: "January 2025",
};