"use client";

import { useState } from "react";
import { useProfile } from "@/src/hooks/use-profile";
import { useUserProfile } from "@/src/hooks/use-user-profile";
import { useMyProducts } from "@/src/hooks/use-my-products";
import ProfileStats from "./profile-stats";
import ProfileHeader from "./profile-header";
import ProfileCover from "./profile-cover";
import ProfileActions from "./profile-actions";
import ProfileTabs from "./profile-tabs";
import EditProfileModal from "./edit-profile-modal";
import { ProfileHeaderSkeleton } from "@/src/components/skeletons/profile-header-skeleton";

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false);
  const { data: profile, isLoading } = useProfile();
  const { data: userProfile } = useUserProfile(profile?.id ?? "");
  const { data: myProducts } = useMyProducts({ limit: 1 });

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 pb-20">
        <ProfileHeaderSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-20">
      <ProfileCover profile={profile} onEditCover={() => setEditOpen(true)} />

      <div className="px-4 md:px-8">
        <ProfileHeader profile={profile} />
        <ProfileStats
          followers={userProfile?.followersCount ?? 0}
          following={userProfile?.followingCount ?? 0}
          posts={userProfile?.postsCount ?? 0}
          listings={myProducts?.total ?? 0}
        />
        <ProfileActions onEdit={() => setEditOpen(true)} />
        <ProfileTabs />
      </div>

      <EditProfileModal opened={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}
