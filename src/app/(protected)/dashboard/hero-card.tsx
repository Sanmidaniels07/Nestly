"use client";

import Button from "@/src/components/ui/button";
import { Sparkles, PenSquare, Compass } from "lucide-react";

interface HeroCardProps {
  name: string;
}

export default function HeroCard({ name }: HeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-10 lg:p-14 text-white shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-white/15 px-5 py-2 backdrop-blur-xl">
          <Sparkles size={20} className="text-yellow-300" />
          <span className="text-sm font-medium">Good evening</span>
        </div>

        <h1 className="mt-7 text-5xl md:text-6xl font-bold leading-none tracking-tighter">
          Hello, {name} 👋
        </h1>

        <p className="mt-6 text-lg text-white/80 leading-relaxed">
          Continue building meaningful connections, sharing ideas, and discovering opportunities across your communities.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button
            className="bg-white text-violet-700 hover:bg-white/90 shadow-lg px-8 py-6 text-base font-semibold"
          >
            <PenSquare size={20} className="mr-3" />
            Create Post
          </Button>

          <Button
            className="border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-6 text-base font-semibold"
          >
            <Compass size={20} className="mr-3" />
            Explore Communities
          </Button>
        </div>
      </div>
    </div>
  );
}