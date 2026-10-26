import { ShieldAlert } from "lucide-react";

// Admin-only view of a suspended store or its products - everyone else
// gets "not found" for these.
export default function SuspendedNotice({ what }: { what: "store" | "product" }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13px] leading-relaxed text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
      <ShieldAlert size={18} className="mt-0.5 shrink-0" />
      <p>
        <span className="font-semibold">This {what === "store" ? "store" : "product's store"} is suspended.</span> Buyers can&apos;t see or
        buy from it - only admins can open this page. Reactivate the seller in Admin &rarr; Users to restore it.
      </p>
    </div>
  );
}
