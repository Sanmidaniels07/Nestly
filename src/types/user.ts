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
