"use client";

import { create } from "zustand";

interface FollowState {
  followingIds: string[];

  toggleFollow: (
    userId: string
  ) => void;

  isFollowing: (
    userId: string
  ) => boolean;
}

export const useFollowStore =
  create<FollowState>(
    (set, get) => ({
      followingIds: ["2", "4"],

      toggleFollow: (
        userId
      ) =>
        set((state) => {
          const exists =
            state.followingIds.includes(
              userId
            );

          return {
            followingIds:
              exists
                ? state.followingIds.filter(
                    (id) =>
                      id !== userId
                  )
                : [
                    ...state.followingIds,
                    userId,
                  ],
          };
        }),

      isFollowing: (
        userId
      ) =>
        get().followingIds.includes(
          userId
        ),
    })
  );