"use client";

import FeedLeftSidebar from "./left-sidebar/left-sidebar-center";
import FeedCenter from "./main-feed/feed-center";
import FeedRightSidebar from "./right-sidebar/right-sidebar-center";

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      {/* minmax(0,1fr) + min-w-0: without them the feed column grows to fit
          wide content while it loads (e.g. the stories strip), so the page
          overflowed on phones for a second or two. The right sidebar only
          appears at xl, so lg has two columns (no empty 320px gap). */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="hidden lg:block">
          <FeedLeftSidebar />
        </aside>

        {/* Stories and posts come first on every screen; on smaller screens
            the sidebar cards are woven in between posts by FeedCenter. */}
        <main className="min-w-0">
          <FeedCenter />
        </main>

        <aside className="hidden xl:block">
          <FeedRightSidebar />
        </aside>
      </div>
    </div>
  );
}