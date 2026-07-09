"use client";

import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

interface Props {
  completed: boolean[];
  onStepClick?: (step: number) => void;
}

const labels = ["Basic information", "Pricing & inventory", "Specifications", "Images", "Shipping"];

export default function CompletionChecklist({ completed, onStepClick }: Props) {
  const doneCount = completed.filter(Boolean).length;
  const percent = Math.round((doneCount / completed.length) * 100);

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#13131A]">Completion checklist</h2>
        <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">
          {percent}%
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ECE9F6]">
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
                ${clickable ? "hover:bg-[#F7F7FB]" : ""}
              `}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 size={17} className="text-emerald-500" />
                ) : (
                  <Circle size={17} className="text-[#CBD5E1]" />
                )}
                <span className={`text-[13.5px] ${isDone ? "text-[#13131A]" : "text-[#94A3B8]"}`}>
                  {label}
                </span>
              </div>

              {clickable && (
                <ChevronRight
                  size={14}
                  className="text-[#C4C0DC] opacity-0 transition-opacity group-hover:opacity-100"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}