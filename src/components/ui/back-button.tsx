"use client";

import { ArrowLeft } from "lucide-react";

import { useGoBack } from "@/src/hooks/use-go-back";

interface Props {
  fallbackHref: string;
  label?: string;
  // Overrides the default single-step back (e.g. a multi-step form leaving
  // all of its steps at once).
  onClick?: () => void;
}

export default function BackButton({ fallbackHref, label = "Back", onClick }: Props) {
  const goBack = useGoBack(fallbackHref);

  return (
    <button
      type="button"
      onClick={onClick ?? (() => goBack())}
      className="-ml-2 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-[#64748B] transition-colors hover:bg-[#F7F7FB] hover:text-violet-700"
    >
      <ArrowLeft size={15} />
      {label}
    </button>
  );
}
