"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/src/components/ui/theme-toggle";
import Button from "@/src/components/ui/button";
import CartButton from "./cart-button";
import Tooltip from "./tooltip";
import SavedButton from "./saved-button";
import LogoutConfirmDialog from "./logout-confirm-dialog";
import GlobalSearch from "./global-search";
import { useAuth } from "@/src/hooks/use-auth";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const pathname = usePathname();
  const showLogin = pathname === "/signup";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-[#ECE9F6] bg-white/85 px-3 backdrop-blur-xl sm:px-5 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-[17px] font-bold text-white">
            N
          </div>
          <span className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
            Nestly
          </span>
        </Link>

        {!isAuthenticated && (
          <div className="hidden items-center gap-8 text-[14px] font-medium md:flex">
            <a
              href="#features"
              className="text-[#64748B] transition-colors hover:text-violet-600"
            >
              Features
            </a>
            <a
              href="#preview"
              className="text-[#64748B] transition-colors hover:text-violet-600"
            >
              Preview
            </a>
          </div>
        )}

        {isAuthenticated && <GlobalSearch />}

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Wishlist/cart aren't meaningful before signing in, and crowd
              the CTA buttons on small screens — keep them for logged-in use
              and past the sm breakpoint for guests. */}
          <div className={isAuthenticated ? "flex items-center gap-2 sm:gap-3" : "hidden items-center gap-2 sm:flex sm:gap-3"}>
            <Tooltip label="Saved products">
              <SavedButton />
            </Tooltip>
            <Tooltip label="Cart">
              <CartButton />
            </Tooltip>
          </div>

          {isAuthenticated ? (
            <Tooltip label="Log out">
              <button
                onClick={() => setLogoutConfirmOpen(true)}
                aria-label="Log out"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ECE9F6] bg-white text-[#64748B] transition-colors hover:border-red-200 hover:text-red-500"
              >
                <LogOut size={18} />
              </button>
            </Tooltip>
          ) : (
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
      </div>

      <LogoutConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
      />
    </nav>
  );
}
