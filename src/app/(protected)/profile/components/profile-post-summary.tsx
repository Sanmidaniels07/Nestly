"use client";

import { FileText, Heart, MessageCircle, Eye } from "lucide-react";

const stats = [
  { label: "Posts", value: "18", icon: FileText, chip: "bg-violet-50 text-violet-600" },
  { label: "Likes", value: "2.4K", icon: Heart, chip: "bg-rose-50 text-rose-600" },
  { label: "Comments", value: "326", icon: MessageCircle, chip: "bg-indigo-50 text-indigo-600" },
  { label: "Views", value: "18.7K", icon: Eye, chip: "bg-emerald-50 text-emerald-600" },
];

export default function ProfilePostSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
        >
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.chip}`}>
            <item.icon size={17} />
          </div>

          <h3 className="mt-4 font-[family-name:var(--font-mono)] text-[24px] font-semibold text-[#13131A]">
            {item.value}
          </h3>

          <p className="mt-0.5 text-[12.5px] font-medium text-[#94A3B8]">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}