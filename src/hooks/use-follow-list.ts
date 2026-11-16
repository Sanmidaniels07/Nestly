"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getFollowers, getFollowing } from "../services/follow.services";
import { PublicUser } from "../types/user";

export type FollowListKind = "followers" | "following";

const PAGE_SIZE = 30;

// Someone's followers or following, a page at a time (the list popup on a
// profile). Shares the ["followers"] / ["following"] keys, so following or
// unfollowing someone refreshes it.
export const useFollowList = (userId: string, kind: FollowListKind, enabled = true) =>
  useInfiniteQuery({
    queryKey: [kind, userId, "infinite"],
    queryFn: async ({ pageParam }) => {
      const params = { page: pageParam, limit: PAGE_SIZE };
      if (kind === "followers") {
        const { data } = await getFollowers(userId, params);
        return { users: data.followers as PublicUser[], page: data.page, totalPages: data.totalPages, total: data.total };
      }
      const { data } = await getFollowing(userId, params);
      return { users: data.following as PublicUser[], page: data.page, totalPages: data.totalPages, total: data.total };
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    enabled: enabled && !!userId,
  });
