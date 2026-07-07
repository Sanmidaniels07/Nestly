"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Action {
  label: string;
  href: string;
}

interface Props {
  title: string;
  subtitle?: string;
  action?: Action;
}

export default function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {subtitle && (
          <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-violet-600">
            {subtitle}
          </p>
        )}

        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[32px] italic leading-none text-[#13131A] sm:text-[38px]">
          {title}
        </h2>
      </div>

      {action && (
        <Link
          href={action.href}
          className="group flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-violet-600 hover:underline"
        >
          {action.label}
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      )}
    </div>
  );
}