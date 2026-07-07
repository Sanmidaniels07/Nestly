import { profile } from "@/src/mocks/profile";
import ProfileStats from "./profile-stats";
import ProfileHeader from "./profile-header";
import ProfileCover from "./profile-cover";
import ProfileActions from "./profile-actions";
import ProfileTabs from "./profile-tabs";
import ProfileSidebar from "./profile-sidebar";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-20">
      <ProfileCover profile={profile} />

      <div className="px-4 md:px-8">
        <ProfileHeader profile={profile} />
        <ProfileStats profile={profile} />
        <ProfileActions />
        <ProfileTabs />
        {/* <ProfileSidebar /> */}
      </div>
    </div>
  );
}