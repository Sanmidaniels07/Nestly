'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-muted"
    >
      {theme === "dark" ? (
        <Sun size={19} className="text-yellow-500" />
      ) : (
        <Moon size={19} />
      )}
    </button>
  );
}