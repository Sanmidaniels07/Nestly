"use client";

import { useEffect, useState } from "react";

interface CountdownResult {
  label: string;
  isDone: boolean;
}

// Ticks off a target ISO datetime client-side (no polling) — formats as
// "2d 14h" while more than a day remains, "3h 20m" once under a day.
export const useCountdown = (targetIso?: string | null): CountdownResult => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetIso) return;

    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, [targetIso]);

  if (!targetIso) {
    return { label: "", isDone: true };
  }

  const diffMs = new Date(targetIso).getTime() - now;

  if (diffMs <= 0) {
    return { label: "", isDone: true };
  }

  const totalMinutes = Math.ceil(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${hours}h`);
  if (days === 0) parts.push(`${minutes}m`);

  return { label: parts.join(" "), isDone: false };
};
