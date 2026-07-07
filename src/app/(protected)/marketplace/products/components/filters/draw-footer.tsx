"use client";

import Button from "@/src/components/ui/button";

interface Props {
  onReset: () => void;
  onApply: () => void;
  activeCount?: number;
}

export default function FilterFooter({ onReset, onApply, activeCount = 0 }: Props) {
  return (
    <div className="sticky bottom-0 border-t border-[#ECE9F6] bg-white/95 p-5 backdrop-blur-sm">
      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset} className="h-11 flex-1 rounded-xl">
          Reset
        </Button>

        <Button variant="tribely" onClick={onApply} className="h-11 flex-1 rounded-xl">
          {activeCount > 0 ? `Show results (${activeCount})` : "Apply filters"}
        </Button>
      </div>
    </div>
  );
}