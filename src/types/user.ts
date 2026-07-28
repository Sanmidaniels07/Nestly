import { SocialLinks } from "./profile";

export interface PublicUser {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  bio?: string | null;
}

export interface SuggestedUser extends PublicUser {
  followerCount: number;
}

export interface UserProfile extends PublicUser {
  cover?: string | null;
  location?: string | null;
  website?: string | null;
  socialLinks?: SocialLinks | null;
  occupation?: string | null;
  company?: string | null;
  education?: string | null;
  dateOfBirth?: string | null;
  skills?: string[];
  interests?: string[];
  languages?: string[];
  createdAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  profileViews: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}
