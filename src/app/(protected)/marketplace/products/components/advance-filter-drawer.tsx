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
          fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-surface
          shadow-2xl transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="border-b border-line p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-fraunces)] text-[28px] italic text-ink">
                Filters
              </h2>
              <p className="mt-1 text-[13.5px] text-muted">Refine your marketplace search.</p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close filters"
              className="rounded-full p-2 text-muted transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400"
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