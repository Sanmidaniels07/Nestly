"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProfilePosts from "./tab-sections/profile-posts";
import ProfileMedia from "./tab-sections/profile-media";
import ProfileMarketplace from "./tab-sections/profile-marketplace";
import ProfileAbout from "./tab-sections/profile-about";



const tabs = [
  "Posts",
  "Media",
  "Marketplace",
  "About",
] as const;

type ProfileTab = (typeof tabs)[number];

export default function ProfileTabs() {
  const [active, setActive] =
    useState<ProfileTab>("Posts");

  return (
    <div className="mt-10">
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="border-b border-[#ECEAF4]"
      >
        <div className="flex gap-7 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const selected =
              active === tab;

            return (
              <button
                key={tab}
                onClick={() =>
                  setActive(tab)
                }
                className="
                  relative
                  whitespace-nowrap
                  pb-4
                  pt-1
                  text-[14px]
                  font-semibold
                  transition-colors
                "
              >
                <span
                  className={
                    selected
                      ? "text-violet-700"
                      : "text-[#64748B]"
                  }
                >
                  {tab}
                </span>

                {selected && (
                  <motion.div
                    layoutId="profileTab"
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-[3px]
                      w-full
                      rounded-full
                      bg-gradient-to-r
                      from-violet-600
                      to-indigo-600
                    "
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={active}
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="mt-8"
      >
        {active === "Posts" && (
          <ProfilePosts />
        )}

        {active === "Media" && (
          <ProfileMedia />
        )}

        {active ===
          "Marketplace" && (
          <ProfileMarketplace />
        )}

     {active === "About" && (
          <ProfileAbout />
        )} 
      </motion.div>
    </div>
  );
}