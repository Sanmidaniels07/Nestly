"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import { useStoriesFeed } from "@/src/hooks/use-stories-feed";
import { AvatarRailSkeleton } from "@/src/components/skeletons/list-row-skeleton";
import CreateStoryModal from "./create-story-modal";
import StoryViewer from "./story-viewer";

export default function Stories() {
  const authUser = useAuthStore((state) => state.user);
  const { data: feedGroups, isLoading } = useStoriesFeed();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewerGroupIndex, setViewerGroupIndex] = useState<number | null>(null);

  if (isLoading) return <AvatarRailSkeleton />;

  if (!feedGroups || !authUser) return null;

  // Users with zero stories of their own simply have no entry in the feed —
  // always show a "Your story" slot regardless, so there's somewhere to tap "+".
  const hasOwnGroup = feedGroups.some((group) => group.author.id === authUser.id);
  const groups = hasOwnGroup
    ? feedGroups
    : [
        {
          author: { id: authUser.id, name: authUser.name, username: null, avatar: null },
          stories: [],
          hasUnseen: false,
        },
        ...feedGroups,
      ];

  return (
    <div className="-mx-2">
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-2 scrollbar-hide">
        {groups.map((group, index) => {
          const isYou = group.author.id === authUser.id;
          const hasStories = group.stories.length > 0;

          return (
            <div
              key={group.author.id}
              className="flex shrink-0 snap-start flex-col items-center gap-2"
            >
              <button
                className="relative"
                onClick={() => {
                  if (isYou && !hasStories) {
                    setCreateOpen(true);
                  } else {
                    setViewerGroupIndex(index);
                  }
                }}
              >
                <div
                  className={`
                    h-[68px] w-[68px] rounded-full p-[2.5px]
                    ${
                      hasStories && group.hasUnseen
                        ? "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600"
                        : "bg-[#E2E0EE]"
                    }
                  `}
                >
                  <div className="h-full w-full rounded-full bg-white p-[3px]">
                    {group.author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={group.author.avatar}
                        alt={group.author.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200 text-[20px] font-semibold text-violet-700">
                        {group.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {isYou && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateOpen(true);
                    }}
                    className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 ring-[3px] ring-white"
                  >
                    <Plus size={13} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </button>

              <p className="max-w-[68px] truncate text-[12.5px] font-medium text-[#334155]">
                {isYou ? "Your story" : group.author.name}
              </p>
            </div>
          );
        })}
      </div>

      <CreateStoryModal open={createOpen} onClose={() => setCreateOpen(false)} />

      {viewerGroupIndex !== null && (
        <StoryViewer
          groups={groups}
          initialGroupIndex={viewerGroupIndex}
          onClose={() => setViewerGroupIndex(null)}
        />
      )}
    </div>
  );
}
