"use client";

import ProfileAchievements from "./components/profile-achievements";
import ProfileSocialLinks from "./components/profile-social-links";
import ProfileCommunities from "./components/profile-communities";
import { featureOn } from "@/src/lib/features";
import ProfileRecentActivity from "./components/profile-recent-activity";
import ProfileAboutSummary from "./components/profile-about-summary-card";

export default function ProfileSidebar() {
  return (
    <aside className="space-y-6">
      <ProfileAboutSummary />

      <ProfileAchievements />

      {featureOn.communities && <ProfileCommunities />}

      <ProfileSocialLinks />

      <ProfileRecentActivity />
    </aside>
  );
}