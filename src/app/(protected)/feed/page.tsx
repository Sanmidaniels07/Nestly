"use client";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import { posts } from "@/src/mocks/post";

export default function FeedPage() {
  return (
    <div
      className="
      max-w-7xl
      mx-auto
      space-y-8
    "
    >
      <Stories />

      <CreatePostCard />

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}