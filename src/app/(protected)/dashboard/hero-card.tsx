"use client";

import Button from "@/src/components/ui/button";
import {
  Sparkles,
  PenSquare,
  Compass,
} from "lucide-react";

interface HeroCardProps {
  name: string;
}

export default function HeroCard({
  name,
}: HeroCardProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[36px]
        bg-gradient-to-br
        from-violet-600
        via-purple-600
        to-indigo-600
        p-8
        lg:p-10
        text-white
        shadow-[0_25px_50px_-12px_rgba(124,58,237,0.35)]
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          -top-24
          -right-20
          h-80
          w-80
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-24
          -left-20
          h-72
          w-72
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-white/15
            px-4
            py-2
            backdrop-blur-xl
          "
        >
          <Sparkles size={18} />

          <span
            className="
              text-sm
              font-medium
            "
          >
            Welcome back
          </span>
        </div>

        <h1
          className="
            mt-6
            text-4xl
            md:text-5xl
            font-bold
            leading-tight
          "
        >
          Good Evening,
          <br />
          {name} 👋
        </h1>

        <p
          className="
            mt-5
            max-w-2xl
            text-base
            md:text-lg
            text-white/80
            leading-8
          "
        >
          Continue building meaningful
          connections, sharing ideas and
          discovering opportunities
          across your communities.
        </p>

        <div
          className="
            mt-10
            flex
            flex-wrap
            gap-4
          "
        >
          <Button
            className="
              bg-white
              text-violet-700
              hover:bg-violet-50
              shadow-lg
              px-8
            "
          >
            <PenSquare
              size={18}
              className="mr-2"
            />
            Create Post
          </Button>

          <Button
            className="
              border
              border-white/20
              bg-white/10
              text-white
              backdrop-blur-xl
              hover:bg-white/20
              px-8
            "
          >
            <Compass
              size={18}
              className="mr-2"
            />
            Explore
          </Button>
        </div>
      </div>
    </div>
  );
}