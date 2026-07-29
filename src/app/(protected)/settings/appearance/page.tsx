"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

import RadioCard from "@/src/components/ui/radio-card";

const OPTIONS = [
  { value: "light", title: "Light", description: "Bright background, dark text.", icon: Sun },
  { value: "dark", title: "Dark", description: "Dim background, easy on the eyes.", icon: Moon },
  {
    value: "system",
    title: "System",
    description: "Match your device's appearance.",
    icon: Monitor,
  },
] as const;

export default function SettingsAppearancePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
          Appearance
        </h2>
        <p className="mt-1 text-[13.5px] text-[#64748B]">
          Choose how Nestly looks on this device.
        </p>
      </div>

      <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
        <h3 className="text-[15px] font-semibold text-[#13131A]">Theme</h3>
        <p className="mt-1 text-[13px] text-[#64748B]">
          This only affects your view — it&apos;s saved to this browser.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              title={option.title}
              description={option.description}
              icon={option.icon}
              selected={mounted && theme === option.value}
              onClick={() => setTheme(option.value)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
