"use client";

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  // What the button does, in a few words.
  label: string;
  children: ReactNode;
}

// A small label above an icon button saying what it does. Shows on mouse
// hover, on keyboard focus, and when the button is pressed and held on a
// phone. Drawn on top of the page, so a scrolling table can't cut it off.
export default function ActionTip({ label, children }: Props) {
  const id = useId();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [box, setBox] = useState<{ x: number; y: number; below: boolean } | null>(null);

  const show = (element: Element) => {
    const r = element.getBoundingClientRect();
    // Above the button, or below it when there's no room at the top.
    const below = r.top < 48;
    // Kept inside the screen (the label is up to 220px wide).
    const x = Math.min(Math.max(r.left + r.width / 2, 120), window.innerWidth - 120);
    setBox({ x, y: below ? r.bottom + 8 : r.top - 8, below });
  };

  // Scrolling moves the button away from the label - just hide it.
  useEffect(() => {
    if (!box) return;
    const onScroll = () => setBox(null);
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [box]);

  return (
    <span
      className="inline-flex"
      aria-describedby={box ? id : undefined}
      onMouseEnter={(event) => show(event.currentTarget)}
      onMouseLeave={() => setBox(null)}
      onFocus={(event) => {
        // Keyboard focus only - a tap also focuses, and the label would stick.
        if ((event.target as HTMLElement).matches(":focus-visible")) show(event.currentTarget);
      }}
      onBlur={() => setBox(null)}
      onTouchStart={(event) => {
        const target = event.currentTarget;
        holdTimer.current = setTimeout(() => show(target), 450);
      }}
      onTouchEnd={() => {
        if (holdTimer.current) clearTimeout(holdTimer.current);
        setTimeout(() => setBox(null), 1200);
      }}
    >
      {children}
      {box &&
        createPortal(
          <span
            id={id}
            role="tooltip"
            style={{ left: box.x, top: box.y }}
            className={`pointer-events-none fixed z-[300] w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-[#13131A] px-2.5 py-1.5 text-center text-[12px] font-medium leading-snug text-white shadow-lg dark:bg-[#2a2839] ${
              box.below ? "" : "-translate-y-full"
            }`}
          >
            {label}
          </span>,
          document.body
        )}
    </span>
  );
}
