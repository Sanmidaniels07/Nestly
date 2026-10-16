"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, FileText, Store } from "lucide-react";

interface Props {
  followers: number;
  following: number;
  posts: number;
  listings: number;
}

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

const stats = (data: Props) => [
  { title: "Followers", value: data.followers, icon: Users, chip: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { title: "Following", value: data.following, icon: UserPlus, chip: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { title: "Posts", value: data.posts, icon: FileText, chip: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { title: "Marketplace", value: data.listings, icon: Store, chip: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
];

export default function ProfileStats(props: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {stats(props).map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 + index * 0.05 }}
          className="
            rounded-2xl border border-line bg-surface p-5
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]
          "
        >
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.chip}`}>
            <item.icon size={17} />
          </div>

          <p className="mt-4 font-[family-name:var(--font-mono)] text-[26px] font-semibold text-ink">
            {formatNumber(item.value)}
          </p>

          <p className="mt-0.5 text-[12.5px] font-medium text-subtle">
            {item.title}
          </p>
        </motion.div>
      ))}
    </motion.section>
  );
}