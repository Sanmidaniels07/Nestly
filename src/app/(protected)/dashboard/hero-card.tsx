"use client";

import { useEffect, useState } from "react";
import Button from "@/src/components/ui/button";
import { Sunrise, Sun, Sunset, Moon, PenSquare, Compass } from "lucide-react";

interface HeroCardProps {
  name: string;
}

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const themes: Record<
  TimeOfDay,
  {
    label: string;
    icon: typeof Sun;
    gradient: string;
    orb1: string;
    orb2: string;
  }
> = {
  morning: {
    label: "Good morning",
    icon: Sunrise,
    gradient: "from-[#4C2A85] via-[#B8557A] to-[#E8925B]",
    orb1: "bg-orange-300/20",
    orb2: "bg-fuchsia-400/10",
  },
  afternoon: {
    label: "Good afternoon",
    icon: Sun,
    gradient: "from-[#1E3A5F] via-[#3E5C9A] to-[#6D8CC7]",
    orb1: "bg-sky-300/15",
    orb2: "bg-blue-400/10",
  },
  evening: {
    label: "Good evening",
    icon: Sunset,
    gradient: "from-[#2A1B4D] via-[#5B2A6D] to-[#B8557A]",
    orb1: "bg-rose-400/15",
    orb2: "bg-violet-400/10",
  },
  night: {
    label: "Good night",
    icon: Moon,
    gradient: "from-[#0C0E1F] via-[#1B1F3B] to-[#2E2456]",
    orb1: "bg-indigo-400/10",
    orb2: "bg-violet-500/10",
  },
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export default function HeroCard({ name }: HeroCardProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("evening");

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
  }, []);

  const theme = themes[timeOfDay];
  const Icon = theme.icon;

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl bg-gradient-to-br
        ${theme.gradient}
        p-8 text-white shadow-2xl sm:p-10 lg:p-14
      `}
    >
      <div className={`absolute -right-20 -top-20 h-96 w-96 rounded-full ${theme.orb1} blur-3xl`} />
      <div className={`absolute -bottom-32 -left-16 h-80 w-80 rounded-full ${theme.orb2} blur-3xl`} />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-xl">
          <Icon size={16} className="text-white/90" />
          <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium tracking-wide text-white/90">
            {theme.label.toUpperCase()}
          </span>
        </div>

        <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-[42px] italic leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Hello, {name}
        </h1>

        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-base">
          Continue building meaningful connections, sharing ideas, and
          discovering opportunities across your communities.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button className="bg-white px-7 py-5 text-[14px] font-semibold text-[#2A1B4D] shadow-lg hover:bg-white/90 sm:px-8 sm:py-6 sm:text-base">
            <PenSquare size={18} className="mr-2.5" />
            Create post
          </Button>

          <Button className="border border-white/20 bg-white/10 px-7 py-5 text-[14px] font-semibold backdrop-blur-xl hover:bg-white/[0.15] sm:px-8 sm:py-6 sm:text-base">
            <Compass size={18} className="mr-2.5" />
            Explore communities
          </Button>
        </div>
      </div>
    </div>
  );
}