"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface AdvancedFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AdvancedFilterDrawer({ open, onClose, children }: AdvancedFilterDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div
           className={`
          fixed inset-0 z-40 bg-black/50 transition-opacity duration-300
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        onClick={onClose}
      />

      <aside
        className={`
          fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-white
          shadow-2xl transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="border-b border-[#ECE9F6] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-fraunces)] text-[28px] italic text-[#13131A]">
                Filters
              </h2>
              <p className="mt-1 text-[13.5px] text-[#64748B]">Refine your marketplace search.</p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close filters"
              className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-violet-50 hover:text-violet-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto p-6">{children}</div>
      </aside>
    </>
  );
}