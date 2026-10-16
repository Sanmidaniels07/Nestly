"use client";

import { Check } from "lucide-react";

interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function CheckboxRow({ label, description, checked, onChange, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${checked ? "border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10" : "border-line hover:border-violet-200 dark:hover:border-violet-500/30"}
      `}
    >
      <div>
        <p className="text-[13.5px] font-medium text-ink">{label}</p>
        {description && <p className="mt-0.5 text-[12px] text-muted">{description}</p>}
      </div>

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked ? "border-violet-600 bg-violet-600" : "border-line-strong bg-surface"
        }`}
      >
        {checked && <Check size={13} className="text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}