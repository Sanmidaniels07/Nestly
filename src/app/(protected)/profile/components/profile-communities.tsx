"use client";

import { joinedCommunities } from "@/src/mocks/profile-sidebar";

export default function ProfileCommunities() {
  return (
    <div className="rounded-[30px] border border-[#ECEAF4] bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">
        Communities
      </h3>

      <div className="mt-5 flex flex-wrap gap-3">
        {joinedCommunities.map((community) => (
          <span
            key={community}
            className="
              rounded-full
              bg-violet-100
              px-4
              py-2
              text-sm
              font-medium
              text-violet-700
            "
          >
            {community}
          </span>
        ))}
      </div>
    </div>
  );
}