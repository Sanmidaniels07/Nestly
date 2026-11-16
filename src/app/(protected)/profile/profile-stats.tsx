"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, FileText, Store } from "lucide-react";

import { FollowListKind } from "@/src/hooks/use-follow-list";

interface Props {
  followers: number;
  following: number;
  posts: number;
  listings: number;
  /** Followers / Following open the list popup. */
  onOpenList?: (kind: FollowListKind) => void;
}

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

const stats = (data: Props) => [
  { title: "Followers", list: "followers" as const, value: data.followers, icon: Users, chip: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { title: "Following", list: "following" as const, value: data.following, icon: UserPlus, chip: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { title: "Posts", list: undefined, value: data.posts, icon: FileText, chip: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { title: "Marketplace", list: undefined, value: data.listings, icon: Store, chip: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
];

export default function ProfileStats(props: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {stats(props).map((item, index) => {
        const opensList = !!(item.list && props.onOpenList);
        return (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 + index * 0.05 }}
          {...(opensList
            ? {
                role: "button",
                tabIndex: 0,
                "aria-label": `See ${item.title.toLowerCase()}`,
                onClick: () => props.onOpenList!(item.list!),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    props.onOpenList!(item.list!);
                  }
                },
              }
            : {})}
          className={`
            rounded-2xl border border-line bg-surface p-5
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]
            ${opensList ? "cursor-pointer hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 dark:hover:border-violet-500/40" : ""}
          `}
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
        );
      })}
    </motion.section>
  );
}