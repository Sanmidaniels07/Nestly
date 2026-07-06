import ProfileSummary from "./profile-summary";
import QuickStats from "./quick-stats";
import TrendingCommunities from "./trending-communities";

export default function LeftSidebar() {
  return (
    <div className="sticky top-24 space-y-6">
      <ProfileSummary />
      <QuickStats />
      <TrendingCommunities />
    </div>
  );
}