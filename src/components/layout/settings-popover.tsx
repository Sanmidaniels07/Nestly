"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, RefObject } from "react";
import { settingsNavigation } from "@/src/constants/settings-navigation";

interface Props {
  email?: string;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
}

export default function SettingsPopover({ email, onClose, anchorRef }: Props) {
  const pathname = usePathname();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom - rect.height,
        left: rect.right + 8,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, anchorRef]);

  if (!mounted || !position) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{ top: position.top, left: position.left }}
      className="fixed z-[100] w-64 rounded-2xl border border-[#ECE9F6] bg-white p-2 shadow-[0_20px_60px_-16px_rgba(15,15,20,0.25)]"
    >
      {email && (
        <div className="border-b border-[#F2F1F8] px-3 py-2.5">
          <p className="truncate font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
            {email}
          </p>
        </div>
      )}

      <div className="space-y-0.5 py-1.5">
        {settingsNavigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`
                relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors
                ${active ? "bg-violet-50 text-violet-700" : "text-[#334155] hover:bg-[#F7F7FB] hover:text-violet-600"}
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
              )}
              <item.icon size={16} className={active ? "text-violet-600" : "text-[#94A3B8]"} />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>,
    document.body
  );
}