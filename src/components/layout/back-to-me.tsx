"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { ME_PAGES } from "@/src/hooks/use-visible-navigation";

// The pages you open from Me (settings, notifications, saved,
// gifts, returns, admin...) get a "Me" link at the top to go straight back -
// on phones and on bigger screens.
export default function BackToMe() {
  const pathname = usePathname() ?? "";
  const under = (page: string) => pathname === page || pathname.startsWith(`${page}/`);
  // Seller Hub lives under /settings but has its own place in the menu.
  const show = pathname !== "/me" && !under("/settings/marketplace") && (ME_PAGES.some(under) || under("/admin"));
  if (!show) return null;
  return (
    <Link
      href="/me"
      className="-mt-2 mb-3 inline-flex h-10 items-center gap-1 rounded-xl pr-3 text-[14px] font-semibold text-violet-700 transition-colors hover:text-violet-800 active:scale-[0.98] dark:text-violet-300"
    >
      <ChevronLeft size={19} /> Me
    </Link>
  );
}
