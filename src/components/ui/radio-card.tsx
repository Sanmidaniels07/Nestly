"use client";

import { CheckCircle2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export default function RadioCard({ title, description, icon: Icon, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors
        ${selected ? "border-violet-400 bg-violet-50 dark:bg-violet-500/10" : "border-line hover:border-violet-200 dark:hover:border-violet-500/30"}
      `}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-violet-100 dark:bg-violet-500/15" : "bg-surface-2"}`}>
        <Icon size={17} className={selected ? "text-violet-600 dark:text-violet-400" : "text-subtle"} />
      </div>

      <div className="flex-1">
        <p className="text-[14px] font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-[12.5px] text-muted">{description}</p>
      </div>

      {selected && <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />}
    </button>
  );
}