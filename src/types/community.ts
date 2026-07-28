export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  creatorId: string;
  createdAt: string;
  memberCount?: number;
  isMember?: boolean;
}

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  icon?: string;
}

export interface CommunityListParams {
  page?: number;
  limit?: number;
  search?: string;
}
