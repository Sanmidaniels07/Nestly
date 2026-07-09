"use client";

import { CheckCircle2 } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  selected: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export default function PaymentMethodCard({
  title,
  subtitle,
  selected,
  icon,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-xl border p-4 text-left transition-colors
        ${
          disabled
            ? "cursor-not-allowed border-[#ECE9F6] opacity-50"
            : selected
            ? "border-violet-400 bg-violet-50"
            : "border-[#ECE9F6] hover:border-violet-200"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              selected ? "bg-violet-100" : "bg-[#F7F7FB]"
            }`}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-[#13131A]">{title}</h3>
            <p className="mt-0.5 text-[12.5px] text-[#64748B]">{subtitle}</p>
          </div>
        </div>

        {selected && !disabled && (
          <CheckCircle2 size={19} className="shrink-0 text-violet-600" />
        )}
      </div>
    </button>
  );
}