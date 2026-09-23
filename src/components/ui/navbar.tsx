"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/src/components/ui/theme-toggle";
import Button from "@/src/components/ui/button";
import CartButton from "./cart-button";
import Tooltip from "./tooltip";
import SavedButton from "./saved-button";
import OrdersButton from "./orders-button";
import NotificationBell from "./notification-bell";
import LogoutConfirmDialog from "./logout-confirm-dialog";
import GlobalSearch from "./global-search";
import { useAuth } from "@/src/hooks/use-auth";
import NestlyMark from "./nestly-mark";
import MobileMoreMenu, { MenuRow } from "./more-menu";

export default function Navbar() {
  const { isAuthenticated, isHydrated } = useAuth();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const pathname = usePathname();
  const showLogin = pathname === "/signup";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-[#ECE9F6] bg-white/85 px-3 backdrop-blur-xl sm:px-5 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <NestlyMark size={34} />
          <span className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
            Nestly
          </span>
        </Link>

        {isHydrated && (
          <>
            {!isAuthenticated && (
              <div className="hidden items-center gap-8 text-[14px] font-medium md:flex">
                {[
                  { href: "/features", label: "Features" },
                  { href: "/preview", label: "Preview" },
                ].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative py-1 transition-colors ${
                        isActive ? "text-violet-600" : "text-[#64748B] hover:text-violet-600"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-indicator"
                          className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {isAuthenticated && <GlobalSearch />}

            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated && (
                <>
                  <div className="hidden sm:block">
                    <ThemeToggle />
                  </div>
                  <div className="hidden sm:block">
                    <Tooltip label="Saved products">
                      <SavedButton />
                    </Tooltip>
                  </div>
                  <div className="hidden sm:block">
                    <Tooltip label="My orders">
                      <OrdersButton />
                    </Tooltip>
                  </div>

                  <Tooltip label="Cart">
                    <CartButton />
                  </Tooltip>
                  <Tooltip label="Notifications">
                    <NotificationBell />
                  </Tooltip>

                  <div className="hidden sm:block">
                    <Tooltip label="Log out">
                      <button
                        onClick={() => setLogoutConfirmOpen(true)}
                        aria-label="Log out"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ECE9F6] bg-white text-[#64748B] transition-colors hover:border-red-200 hover:text-red-500"
                      >
                        <LogOut size={18} />
                      </button>
                    </Tooltip>
                  </div>

                  <MobileMoreMenu>
                    <MenuRow icon={<ThemeToggle />} label="Theme" showChevron={false} />
                    <MenuRow icon={<SavedButton />} label="Saved products" />
                    <MenuRow icon={<OrdersButton />} label="My orders" />
                    <div className="my-1.5 h-px bg-[#F2F1F8]" />
                    <button
                      onClick={() => setLogoutConfirmOpen(true)}
                      className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-red-50 active:scale-[0.98]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                        <LogOut size={15} className="text-red-500" />
                      </div>
                      <span className="text-[13.5px] font-medium text-red-600">Log out</span>
                    </button>
                  </MobileMoreMenu>
                </>
              )}

              {!isAuthenticated && (
                <>
                  {showLogin && (
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        Log in
                      </Button>
                    </Link>
                  )}
                  <Link href="/signup">
                    <Button variant="tribely" size="sm">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <LogoutConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
      />
    </nav>
  );
}