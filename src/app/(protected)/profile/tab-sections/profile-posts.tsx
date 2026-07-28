"use client";

import { motion } from "framer-motion";

import { usePosts } from "@/src/hooks/use-posts";
import { useAuthStore } from "@/src/store/auth-store";
import PostCard from "../../feed/main-feed/post-card";
import ProfilePostSummary from "../components/profile-post-summary";
import ProfileEmptyPost from "../components/profile-empty-post";

export default function ProfilePosts() {
  const userId = useAuthStore((state) => state.user?.id);

  const { data, isLoading } = usePosts(
    { authorId: userId, sort: "desc" },
    { enabled: !!userId }
  );

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];
  const postCount = data?.pages[0]?.data.total ?? 0;

  if (isLoading || !userId) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-10 text-center text-[14px] text-[#94A3B8]">
        Loading posts...
      </div>
    );
  }

  if (!posts.length) {
    return <ProfileEmptyPost />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <ProfilePostSummary postCount={postCount} />

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recent Posts</h2>
          <p className="text-slate-500">Latest activity</p>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
