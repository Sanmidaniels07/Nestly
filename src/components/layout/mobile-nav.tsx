"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/src/constants/navigation";
import { cn } from "@/src/lib/utils";

export default function MobileNav() {
  const pathname =
    usePathname();

  return (
    <div
      className="
        fixed
        bottom-6
        left-1/2
        z-50
        flex
        -translate-x-1/2
        gap-1
        rounded-full
        border
        border-white/50
        bg-white/80
        p-2
        backdrop-blur-2xl
        shadow-2xl
        lg:hidden
      "
    >
      {navigation
        .slice(0, 5)
        .map((item) => {
          const active =
            pathname ===
            item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                `
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                `,
                active
                  ? `
                    bg-gradient-to-r
                    from-violet-600
                    to-indigo-600
                    text-white
                  `
                  : `
                    text-gray-500
                  `
              )}
            >
              <item.icon
                size={20}
              />
            </Link>
          );
        })}
    </div>
  );
}