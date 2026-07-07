"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, X } from "lucide-react";
import { navigation } from "@/src/constants/navigation";
import { cn } from "@/src/lib/utils";

const VISIBLE_COUNT = 4;

export default function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const primaryItems = navigation.slice(0, VISIBLE_COUNT);
  const overflowItems = navigation.slice(VISIBLE_COUNT);

  const isOverflowActive = overflowItems.some((item) => isActive(item.href));

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#ECE9F6] bg-white/90 backdrop-blur-2xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-1 py-2">
          {primaryItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5"
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", active ? "bg-violet-50" : "")}>
                  <item.icon size={20} className={active ? "text-violet-600" : "text-[#94A3B8]"} />
                </div>
                <span className={cn("text-[10.5px] font-medium", active ? "text-violet-600" : "text-[#94A3B8]")}>
                  {item.title}
                </span>
              </Link>
            );
          })}

          {overflowItems.length > 0 && (
            <button
              onClick={() => setMoreOpen(true)}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5"
            >
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", isOverflowActive ? "bg-violet-50" : "")}>
                <MoreHorizontal size={20} className={isOverflowActive ? "text-violet-600" : "text-[#94A3B8]"} />
              </div>
              <span className={cn("text-[10.5px] font-medium", isOverflowActive ? "text-violet-600" : "text-[#94A3B8]")}>
                More
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* More sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white p-5 lg:hidden"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
                  More
                </h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  aria-label="Close"
                  className="rounded-full p-2 text-[#64748B] hover:bg-[#F7F7FB]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {overflowItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col items-center gap-1.5 rounded-xl py-3"
                    >
                      <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", active ? "bg-violet-50" : "bg-[#F7F7FB]")}>
                        <item.icon size={20} className={active ? "text-violet-600" : "text-[#64748B]"} />
                      </div>
                      <span className={cn("text-center text-[11.5px] font-medium leading-tight", active ? "text-violet-600" : "text-[#334155]")}>
                        {item.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}