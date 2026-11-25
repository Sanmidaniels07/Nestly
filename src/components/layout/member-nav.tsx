"use client";

import { usePathname } from "next/navigation";

import { useAuth } from "@/src/hooks/use-auth";
import MobileNav from "./mobile-nav";

// Guides, terms and other reading pages have their own simple layout. When
// you're signed in (you came from Me, say), they still get the phone's
// bottom bar so you're never stuck without a way back.
const READING_PAGES = ["/guides", "/terms", "/privacy", "/seller-terms", "/features"];

export default function MemberNav() {
  const pathname = usePathname() ?? "";
  const { isAuthenticated } = useAuth();
  const reading = READING_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`));
  if (!reading || !isAuthenticated) return null;
  return (
    <>
      {/* Room at the bottom so the last lines aren't hidden under the bar. */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <MobileNav />
    </>
  );
}
