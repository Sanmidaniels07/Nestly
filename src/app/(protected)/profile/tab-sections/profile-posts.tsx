"use client";

import { motion } from "framer-motion";
import ProfilePostSummary from "../components/profile-post-summary";
import ProfilePostCard from "../components/profile-post-card";
import ProfileEmptyPost from "../components/profile-empty-post";
import { profilePosts } from "@/src/mocks/profile-posts";

export default function ProfilePosts() {
  const pinnedPost = profilePosts.find(
    (post) => post.pinned
  );

  const recentPosts = profilePosts.filter(
    (post) => !post.pinned
  );

  if (!profilePosts.length) {
    return <ProfileEmptyPost />;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="space-y-8"
    >
      {/* Summary */}
      <ProfilePostSummary />

      {/* Pinned */}
      {pinnedPost && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Pinned
            </h2>

            <p className="text-slate-500">
              Highlighted post
            </p>
          </div>

          <ProfilePostCard
            post={pinnedPost}
          />
        </section>
      )}

      {/* Recent */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Posts
          </h2>

          <p className="text-slate-500">
            Latest activity
          </p>
        </div>

        <div className="space-y-6">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
            >
              <ProfilePostCard
                post={post}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}