"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  iconColor?: string;
}

export default function ActionCard({
  title,
  description,
  href,
  icon: Icon,
  color = "bg-violet-50",
  iconColor = "text-violet-600",
}: Props) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${color}`}>
          <Icon size={19} className={iconColor} />
        </div>

        <ArrowRight
          size={16}
          className="text-[#C4C0DC] transition-all group-hover:translate-x-0.5 group-hover:text-violet-600"
        />
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#13131A]">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#64748B]">{description}</p>
    </Link>
  );
}