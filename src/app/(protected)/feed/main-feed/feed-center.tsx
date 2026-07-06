"use client";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import { posts } from "@/src/mocks/post";

export default function FeedCenter() {
  return (
    <div className="space-y-6">
      <Stories />

      <CreatePostCard />

      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}