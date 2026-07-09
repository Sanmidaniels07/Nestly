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
        ${selected ? "border-violet-400 bg-violet-50" : "border-[#ECE9F6] hover:border-violet-200"}
      `}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-violet-100" : "bg-[#F7F7FB]"}`}>
        <Icon size={17} className={selected ? "text-violet-600" : "text-[#94A3B8]"} />
      </div>

      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[#13131A]">{title}</p>
        <p className="mt-0.5 text-[12.5px] text-[#64748B]">{description}</p>
      </div>

      {selected && <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-violet-600" />}
    </button>
  );
}