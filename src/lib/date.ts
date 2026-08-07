export function isSameDay(a: string | Date, b: string | Date): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

// "Today" / "Yesterday" / "Wednesday" (this week) / "Jan 5" or "Jan 5, 2024"
// once it's from a previous year - the day-separator label in a chat thread.
export function formatDayLabel(date: string | Date): string {
  const target = new Date(date);
  const now = new Date();

  if (isSameDay(target, now)) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(target, yesterday)) return "Yesterday";

  const daysAgo = Math.round(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime()) /
      86400000
  );
  if (daysAgo > 1 && daysAgo < 7) {
    return target.toLocaleDateString("en-US", { weekday: "long" });
  }

  return target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: target.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// "3:45 PM" - clock time for a message bubble, distinct from the relative
// "2h ago" style used in list previews.
export function formatTimeOfDay(date: string | Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const then = new Date(date).getTime();
  const seconds = Math.floor((Date.now() - then) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
