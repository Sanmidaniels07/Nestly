"use client";

import Link from "next/link";
import { Eye, Heart, PenLine, Users } from "lucide-react";

import { UserDashboard } from "@/src/types/user-dashboard";
import { formatCount } from "./format";

interface Props {
  data: UserDashboard;
}

export default function DashboardStats({ data }: Props) {
  const { social, range } = data;

  const tiles = [
    {
      label: "Followers",
      value: social.followers,
      detail: social.newFollowers > 0 ? `+${formatCount(social.newFollowers)} in ${range.days} days` : `Following ${formatCount(social.following)}`,
      positive: social.newFollowers > 0,
      icon: Users,
      tint: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      href: "/followers",
    },
    {
      label: "Profile views",
      value: social.profileViews,
      detail: `Last ${range.days} days`,
      positive: false,
      icon: Eye,
      tint: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
      href: "/profile",
    },
    {
      label: "Likes received",
      value: social.likesReceived,
      detail: social.newLikes > 0 ? `+${formatCount(social.newLikes)} in ${range.days} days` : "On all your posts",
      positive: social.newLikes > 0,
      icon: Heart,
      tint: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
      href: "/profile",
    },
    {
      label: "Posts",
      value: social.posts,
      detail: `${formatCount(social.commentsReceived)} comment${social.commentsReceived === 1 ? "" : "s"} received`,
      positive: false,
      icon: PenLine,
      tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      href: "/profile",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className="group rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-medium text-muted sm:text-[13px]">{tile.label}</p>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tile.tint}`}>
              <tile.icon size={15} />
            </span>
          </div>
          <p className="mt-3 font-[family-name:var(--font-mono)] text-[26px] font-semibold leading-none text-ink sm:text-[30px]">
            {formatCount(tile.value)}
          </p>
          <p
            className={`mt-2 truncate text-[12px] ${
              tile.positive ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-subtle"
            }`}
          >
            {tile.detail}
          </p>
        </Link>
      ))}
    </section>
  );
}
