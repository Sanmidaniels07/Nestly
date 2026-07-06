"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

interface Props {
  isFollowing: boolean;
  onClick: () => void;
}

export default function FollowButton({ isFollowing, onClick }: Props) {
  const [hovering, setHovering] = useState(false);

  const showUnfollow = isFollowing && hovering;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-4 py-2 text-[13px] font-semibold
        transition-all duration-200
        ${
          isFollowing
            ? showUnfollow
              ? "border border-red-200 bg-red-50 text-red-600"
              : "border border-[#E5E7EB] bg-white text-[#334155]"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 hover:brightness-110"
        }
      `}
    >
      {isFollowing ? (
        showUnfollow ? (
          "Unfollow"
        ) : (
          <>
            <Check size={14} />
            Following
          </>
        )
      ) : (
        <>
          <Plus size={14} />
          Follow
        </>
      )}
    </button>
  );
}