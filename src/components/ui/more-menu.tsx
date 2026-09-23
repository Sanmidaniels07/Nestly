"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronRight, MoreHorizontal } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0 },
};

export function MenuRow({
  icon,
  label,
  showChevron = true,
}: {
  icon: React.ReactNode;
  label: string;
  showChevron?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const interactive = ref.current?.querySelector<HTMLElement>("button, a");
    if (interactive && !interactive.contains(e.target as Node)) {
      interactive.click();
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className="group flex cursor-pointer items-center gap-3 rounded-2xl px-2.5 py-2.5 transition-colors hover:bg-violet-50/70 active:scale-[0.98]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">{icon}</div>
      <span className="flex-1 text-[13.5px] font-medium text-[#13131A]">{label}</span>
      {showChevron && (
        <ChevronRight
          size={15}
          className="shrink-0 text-[#CBD5E1] transition-colors group-hover:text-violet-400"
        />
      )}
    </div>
  );
}

export default function MobileMoreMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="More options"
        aria-expanded={open}
        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
          open
            ? "border-violet-200 bg-violet-50 text-violet-600"
            : "border-[#ECE9F6] bg-white text-[#64748B] hover:border-violet-200 hover:text-violet-600"
        }`}
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-[#13131A]/10 backdrop-blur-[2px] sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              style={{ transformOrigin: "top right" }}
              className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-3xl border border-[#ECE9F6] bg-white/95 p-2 shadow-[0_24px_60px_-16px_rgba(76,29,149,0.22)] backdrop-blur-xl"
            >
              <p className="px-3 pb-1.5 pt-1 font-[family-name:var(--font-mono)] text-[10.5px] font-medium uppercase tracking-[0.2em] text-[#94A3B8]">
                Quick access
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-0.5"
                onClick={() => setOpen(false)}
              >
                {Children.map(children, (child, i) =>
                  isValidElement(child) ? (
                    <motion.div variants={itemVariants} key={i}>
                      {child}
                    </motion.div>
                  ) : (
                    child
                  )
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}