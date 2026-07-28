"use client";

import { FileText } from "lucide-react";

interface Props {
  postCount: number;
}

export default function ProfilePostSummary({ postCount }: Props) {
  return (
    <div className="max-w-[220px]">
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <FileText size={17} />
        </div>

        <h3 className="mt-4 font-[family-name:var(--font-mono)] text-[24px] font-semibold text-[#13131A]">
          {postCount}
        </h3>

        <p className="mt-0.5 text-[12.5px] font-medium text-[#94A3B8]">
          Posts
        </p>
      </div>
    </div>
  );
}
