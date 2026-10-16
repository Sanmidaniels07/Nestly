"use client";

import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

interface Props {
  completed: boolean[];
  onStepClick?: (step: number) => void;
}

const labels = ["Basic information", "Pricing & inventory", "Specifications", "Images"];

export default function CompletionChecklist({ completed, onStepClick }: Props) {
  const doneCount = completed.filter(Boolean).length;
  const percent = Math.round((doneCount / completed.length) * 100);

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">Completion checklist</h2>
        <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700 dark:text-violet-300">
          {percent}%
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-5 space-y-1">
        {labels.map((label, index) => {
          const isDone = completed[index];
          const clickable = Boolean(onStepClick);

          return (
            <button
              key={label}
              onClick={() => onStepClick?.(index + 1)}
              disabled={!clickable}
              className={`
                group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors
                ${clickable ? "hover:bg-surface-2" : ""}
              `}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 size={17} className="text-emerald-500" />
                ) : (
                  <Circle size={17} className="text-faint" />
                )}
                <span className={`text-[13.5px] ${isDone ? "text-ink" : "text-subtle"}`}>
                  {label}
                </span>
              </div>

              {clickable && (
                <ChevronRight
                  size={14}
                  className="text-faint opacity-0 transition-opacity group-hover:opacity-100"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}