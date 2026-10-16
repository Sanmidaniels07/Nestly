'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // resolvedTheme, not theme: with "system" selected, theme is "system" and
  // the icon/toggle would ignore what's actually on screen.
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2"
    >
      {resolvedTheme === "dark" ? (
        <Sun size={19} className="text-yellow-500" />
      ) : (
        <Moon size={19} />
      )}
    </button>
  );
}