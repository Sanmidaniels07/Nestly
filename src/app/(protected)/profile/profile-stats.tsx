"use client";

import { motion } from "framer-motion";
import { Profile } from "@/src/mocks/profile";
import { Users, UserPlus, FileText, Store } from "lucide-react";

interface Props {
  profile: Profile;
}

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

const stats = (profile: Profile) => [
  { title: "Followers", value: profile.followers, icon: Users, chip: "bg-violet-50 text-violet-600" },
  { title: "Following", value: profile.following, icon: UserPlus, chip: "bg-indigo-50 text-indigo-600" },
  { title: "Posts", value: profile.posts, icon: FileText, chip: "bg-emerald-50 text-emerald-600" },
  { title: "Marketplace", value: profile.listings, icon: Store, chip: "bg-amber-50 text-amber-600" },
];

export default function ProfileStats({ profile }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {stats(profile).map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 + index * 0.05 }}
          className="
            rounded-2xl border border-[#ECE9F6] bg-white p-5
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]
          "
        >
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.chip}`}>
            <item.icon size={17} />
          </div>

          <p className="mt-4 font-[family-name:var(--font-mono)] text-[26px] font-semibold text-[#13131A]">
            {formatNumber(item.value)}
          </p>

          <p className="mt-0.5 text-[12.5px] font-medium text-[#94A3B8]">
            {item.title}
          </p>
        </motion.div>
      ))}
    </motion.section>
  );
}