"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import NotificationsContent from "./notifications-content";

interface Props {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
}

export default function NotificationsModal({ open, onClose, anchorRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      // Anchor to the bell's bottom-right corner and grow down-left — the
      // trigger sits in the top navbar, so opening downward keeps it on
      // screen regardless of scroll position.
      setPosition({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
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
  }, [open, onClose, anchorRef]);

  if (!mounted || !open || !position) return null;

  return createPortal(
    <div
      ref={panelRef}
      style={{ top: position.top, right: position.right }}
      className="fixed z-[200] w-[min(24rem,calc(100vw-2rem))] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-[#ECE9F6] bg-white shadow-[0_20px_60px_-16px_rgba(15,15,20,0.25)]"
    >
      <button
        onClick={onClose}
        aria-label="Close notifications"
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F7F7FB] hover:text-[#13131A]"
      >
        <X size={17} />
      </button>

      <div className="p-5 pt-14">
        <NotificationsContent onNavigate={onClose} />
      </div>
    </div>,
    document.body
  );
}
