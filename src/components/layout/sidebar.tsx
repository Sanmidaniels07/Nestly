"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/src/constants/navigation";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/auth-store";

export default function Sidebar() {
  const pathname =
    usePathname();

  const user =
    useAuthStore(
      (state) => state.user
    );

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        hidden
        h-screen
        w-[280px]
        border-r
        border-white/50
        bg-white/70
        backdrop-blur-2xl
        lg:flex
        flex-col
        mt-10
        overflow-y-auto
      "
    >
      {/* Logo */}

      <div
        className="
          flex
          items-center
          gap-3
          px-8
          py-8
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-3xl
            bg-gradient-to-br
            from-violet-600
            to-indigo-600
            text-xl
            font-bold
            text-white
            shadow-lg
          "
        >
          N
        </div>

        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Nestly
          </h1>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Social Marketplace
          </p>
        </div>
      </div>

      {/* Navigation */}

      <nav
        className="
          flex-1
          px-5
          space-y-2
        "
      >
        {navigation.map(
          (item) => {
            const active =
              pathname ===
              item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  `
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    px-5
                    py-4
                    font-medium
                    transition-all
                  `,
                  active
                    ? `
                      bg-gradient-to-r
                      from-violet-600
                      to-indigo-600
                      text-white
                      shadow-lg
                    `
                    : `
                      text-gray-600
                      hover:bg-white
                      hover:text-slate-900
                    `
                )}
              >
                <item.icon
                  size={22}
                />

                <span>
                  {item.title}
                </span>
              </Link>
            );
          }
        )}
      </nav>

      {/* User Card */}

      <div className="p-5">
        <div
          className="
            rounded-[28px]
            bg-white
            p-5
            shadow-lg
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-violet-600
                to-indigo-600
                text-lg
                font-bold
                text-white
              "
            >
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3
                className="
                  font-semibold
                  text-slate-900
                "
              >
                {user?.name}
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                  truncate
                "
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}