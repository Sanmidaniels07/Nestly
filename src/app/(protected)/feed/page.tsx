"use client";

import FeedLeftSidebar from "./left-sidebar/left-sidebar-center";
import FeedCenter from "./main-feed/feed-center";
import FeedRightSidebar from "./right-sidebar/right-sidebar-center";
import MarketplacePreview from "./right-sidebar/marketplace-preview";
import SuggestedPeople from "./right-sidebar/suggested-friends";

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr_320px]">
        <aside className="hidden lg:block">
          <FeedLeftSidebar />
        </aside>

        <main className="space-y-6">
          {/* Mobile-only: condensed strip of what the sidebars carry */}
          <div className="space-y-4 lg:hidden">
            <MarketplacePreview />
            <SuggestedPeople />
          </div>

          <FeedCenter />
        </main>

        <aside className="hidden xl:block">
          <FeedRightSidebar />
        </aside>
      </div>
    </div>
  );
}