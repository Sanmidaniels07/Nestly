"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { readReturnPath } from "@/src/lib/return-path";

// "Back" to wherever the user opened this page from; home when unknown
// (e.g. they landed here straight from Google).
export default function LegalBackLink() {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    setHref(readReturnPath());
  }, []);

  return (
    <Link
      href={href ?? "/"}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface pl-3 pr-4 text-[13px] font-semibold text-ink shadow-sm transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:border-violet-500/40 dark:hover:text-violet-300"
    >
      <ArrowLeft size={15} />
      {href ? "Back" : "Back to Nestly"}
    </Link>
  );
}
