"use client";

import { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export default function Tooltip({ label, children }: Props) {
  return (
    <div className="group/tooltip relative flex items-center">
      {children}

      <span
        className="
          pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2
          whitespace-nowrap rounded-lg bg-[#13131A] px-2.5 py-1.5 text-[11.5px] font-medium text-white
          opacity-0 shadow-lg transition-all duration-150
          group-hover/tooltip:translate-y-0.5 group-hover/tooltip:opacity-100
        "
      >
        {label}
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#13131A]" />
      </span>
    </div>
  );
}