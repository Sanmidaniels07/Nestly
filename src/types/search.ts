import { Post } from "./post";
import { Community } from "./community";
import { Hashtag } from "./hashtag";

export type SearchResultType = "users" | "stores" | "posts" | "communities" | "hashtags";

export interface SearchUser {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface SearchStore {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  city: string | null;
  state: string | null;
  isVerified: boolean;
  rating: number;
}

export interface QuickSearchResult {
  users: SearchUser[];
  stores: SearchStore[];
  posts: Post[];
  communities: Community[];
  hashtags: Hashtag[];
}

export interface SearchByTypeParams {
  q: string;
  page?: number;
  limit?: number;
}

export type SearchByTypeItem<T extends SearchResultType> = T extends "users"
  ? SearchUser
  : T extends "stores"
    ? SearchStore
    : T extends "posts"
    ? Post
    : T extends "communities"
      ? Community
      : Hashtag;
