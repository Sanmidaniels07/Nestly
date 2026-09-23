"use client";

import {
  CSSProperties,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import NotificationsContent from "./notifications-content";

interface Props {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
}

const EDGE_GAP = 16;

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
      setPosition({
        top: rect.bottom + 8,
        right: Math.max(EDGE_GAP, window.innerWidth - rect.right),
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

    const handleClickOutside = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", handleClickOutside);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, anchorRef]);

  if (!mounted || !open || !position) return null;

  const style = {
    "--panel-top": `${position.top}px`,
    "--panel-right": `${position.right}px`,
  } as CSSProperties;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      style={style}
      className={[
        "fixed z-[200] top-[var(--panel-top)]",
        "inset-x-4",
        "sm:inset-x-auto sm:right-[var(--panel-right)] sm:w-96",
        "max-h-[calc(100dvh-6rem)] overflow-y-auto",
        "rounded-2xl border border-[#ECE9F6] bg-white",
        "shadow-[0_20px_60px_-16px_rgba(15,15,20,0.25)]",
      ].join(" ")}
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