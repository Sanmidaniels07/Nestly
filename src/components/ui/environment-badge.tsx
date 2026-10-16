import { isStaging } from "@/src/lib/environment";

// Always-visible marker on staging so testers (and anyone sent a link)
// never mistake it for the live site. Pinned bottom-left, above the mobile
// bottom nav, so it never covers the fixed navbar.
export default function EnvironmentBadge() {
  if (!isStaging) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-24 left-3 z-[60] rounded-full bg-amber-500 px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-widest text-amber-950 shadow-lg lg:bottom-4"
    >
      Staging · test data
    </div>
  );
}
