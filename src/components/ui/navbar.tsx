"use client";

import Link from "next/link";
import ThemeToggle from "@/src/components/ui/theme-toggle";
import Button from "@/src/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-[#ECE9F6] bg-white/85 px-5 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-[17px] font-bold text-white">
            N
          </div>
          <span className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
            Nestly
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-[14px] font-medium md:flex">
          <a href="#features" className="text-[#64748B] transition-colors hover:text-violet-600">
            Features
          </a>
          <a href="#preview" className="text-[#64748B] transition-colors hover:text-violet-600">
            Preview
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="tribely" size="sm">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}