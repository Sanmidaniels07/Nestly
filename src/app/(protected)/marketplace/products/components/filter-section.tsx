"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function FilterSection({ title, children }: Props) {
  return (
    <section className="space-y-3 border-b border-[#F2F1F8] pb-6 last:border-0 last:pb-0">
      <h3 className="text-[14px] font-semibold text-[#13131A]">{title}</h3>
      {children}
    </section>
  );
}