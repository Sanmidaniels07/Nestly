import { History, X } from "lucide-react";

// Shown when a form brought back what someone typed before (useFormDraft),
// with a way to throw it away and start fresh.
export default function DraftRestoredNotice({
  onStartOver,
  onDismiss,
  what = "what you entered",
  className = "",
}: {
  onStartOver: () => void;
  onDismiss?: () => void;
  what?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-[13px] leading-snug text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100 ${className}`}
    >
      <History size={17} className="shrink-0" aria-hidden />
      <p className="min-w-0 flex-1">We brought back {what} last time.</p>
      <button type="button" onClick={onStartOver} className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline">
        Start over
      </button>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="shrink-0 rounded-full p-1 hover:bg-violet-100 dark:hover:bg-violet-500/20">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
