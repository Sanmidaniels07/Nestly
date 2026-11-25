import MarketplacePreview from "./marketplace-preview";
import SuggestedFriends from "./suggested-friends";
import TrendingHashtags from "./trending-hashtags";
import UpcomingEvents from "./upcoming-events";
import { featureOn } from "@/src/lib/features";

export default function RightSidebar() {
  return (
    <div className="sticky top-24 space-y-6">
      <SuggestedFriends />
      <TrendingHashtags />
      <MarketplacePreview />
      {featureOn.events && <UpcomingEvents />}
    </div>
  );
}