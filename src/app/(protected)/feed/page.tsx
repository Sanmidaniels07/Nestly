"use client";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import { posts } from "@/src/mocks/post";

export default function FeedPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-20 space-y-8">
      <Stories />

      <CreatePostCard />

      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}