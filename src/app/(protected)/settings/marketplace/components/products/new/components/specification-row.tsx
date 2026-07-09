"use client";

import { Trash2 } from "lucide-react";
import Input from "@/src/components/ui/input";

interface Props {
  specification: {
    id: string;
    key: string;
    value: string;
  };
  onChange: (id: string, field: "key" | "value", value: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export default function SpecificationRow({ specification, onChange, onDelete, canDelete }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
      <Input
        value={specification.key}
        placeholder="e.g. Processor"
        onChange={(e) => onChange(specification.id, "key", e.target.value)}
      />

      <Input
        value={specification.value}
        placeholder="e.g. Apple M3"
        onChange={(e) => onChange(specification.id, "value", e.target.value)}
      />

      <button
        onClick={() => onDelete(specification.id)}
        disabled={!canDelete}
        aria-label="Remove specification"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border border-red-100 bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-50"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}