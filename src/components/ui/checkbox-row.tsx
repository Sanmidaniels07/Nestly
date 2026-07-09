"use client";

import { Check } from "lucide-react";

interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CheckboxRow({ label, description, checked, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors
        ${checked ? "border-violet-300 bg-violet-50" : "border-[#ECE9F6] hover:border-violet-200"}
      `}
    >
      <div>
        <p className="text-[13.5px] font-medium text-[#13131A]">{label}</p>
        {description && <p className="mt-0.5 text-[12px] text-[#64748B]">{description}</p>}
      </div>

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked ? "border-violet-600 bg-violet-600" : "border-[#D4D2E3] bg-white"
        }`}
      >
        {checked && <Check size={13} className="text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}