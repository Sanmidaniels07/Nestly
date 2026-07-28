import { MediaType } from "./upload";
import { PublicUser } from "./user";

export interface Story {
  id: string;
  authorId: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface StoryDetail extends Story {
  author: PublicUser;
  _count: {
    views: number;
    reactions: number;
  };
}

export interface StoryFeedItem extends Story {
  reactionCount: number;
  seenByMe: boolean;
}

export interface StoryAuthorGroup {
  author: PublicUser;
  stories: StoryFeedItem[];
  hasUnseen: boolean;
}

export interface CreateStoryPayload {
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
}

export interface StoryViewer {
  id: string;
  storyId: string;
  viewerId: string;
  viewedAt: string;
  viewer: PublicUser;
}

export interface StoryReaction {
  id: string;
  storyId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}
