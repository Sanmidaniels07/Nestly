"use client";

interface Props {
  label: string;
  value: string;
  bold?: boolean;
  tone?: string;
}

export default function SummaryRow({ label, value, bold = false, tone }: Props) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-[14.5px] font-semibold text-[#13131A]" : "text-[13.5px] text-[#64748B]"}>
        {label}
      </span>
      <span
        className={`font-[family-name:var(--font-mono)] ${
          bold ? "text-[17px] font-semibold text-violet-700" : "text-[13.5px] text-[#334155]"
        } ${tone ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}