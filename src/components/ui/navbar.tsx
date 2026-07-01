'use client';

import Link from "next/link";
import ThemeToggle from "@/src/components/ui/theme-toggle";
import Button from "@/src/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#E5E7EB] h-16 flex items-center px-6 md:px-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            N
          </div>
          <div className="font-bold text-2xl tracking-tight">Nestly</div>
        </div>

        <div className="hidden md:flex items-center gap-10 font-medium text-sm">
          <a href="#features" className="text-[#6B7280] hover:text-[#2B7FFF] transition-colors">Features</a>
          <a href="#preview" className="text-[#6B7280] hover:text-[#2B7FFF] transition-colors">Preview</a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="tribely" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}