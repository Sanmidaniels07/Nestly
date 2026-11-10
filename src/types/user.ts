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
  // No dateOfBirth: public profiles never include it (privacy).
  skills?: string[];
  interests?: string[];
  languages?: string[];
  createdAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  profileViews: number;
  /** Whether this viewer may see their wishlist (gift ideas); count is null if not. */
  wishlist?: { visibility: "PRIVATE" | "FOLLOWERS" | "EVERYONE"; canView: boolean; count: number | null };
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}
