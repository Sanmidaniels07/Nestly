"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Flag, X } from "lucide-react";

import { useCreateReport } from "@/src/hooks/use-create-report";
import { ReportTargetType } from "@/src/types/report";

interface Props {
  targetType: ReportTargetType;
  targetId: string;
  className?: string;
  label?: string;
}

export default function ReportButton({ targetType, targetId, className, label = "Report" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          "flex items-center gap-1.5 text-[13px] font-medium text-subtle transition-colors hover:text-red-500"
        }
      >
        <Flag size={14} />
        {label}
      </button>

      <ReportModal
        open={open}
        onClose={() => setOpen(false)}
        targetType={targetType}
        targetId={targetId}
      />
    </>
  );
}

function ReportModal({
  open,
  onClose,
  targetType,
  targetId,
}: {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [reason, setReason] = useState("");
  const { mutate: createReport, isPending } = useCreateReport();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const handleSubmit = () => {
    if (reason.trim().length < 3) return;

    createReport(
      { targetType, targetId, reason: reason.trim() },
      {
        onSuccess: () => {
          setReason("");
          onClose();
        },
      }
    );
  };

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-ink">
            Report {targetType.toLowerCase()}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <label className="mb-2 block text-[13.5px] font-medium text-ink-2">
            What&apos;s wrong?
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Tell us what's going on..."
            className="w-full resize-none rounded-2xl border border-line-strong bg-surface-sunken px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400 focus:bg-surface"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-muted hover:bg-surface-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={reason.trim().length < 3 || isPending}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit report"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
