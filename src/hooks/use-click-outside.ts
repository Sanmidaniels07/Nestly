"use client";

import { useEffect, RefObject } from "react";

type ClickOutsideRef = RefObject<HTMLElement | null>;

// Closes an open menu/panel/popover when the user clicks (or taps) anywhere
// outside the given element(s). Pass every element that should count as
// "inside" - typically the trigger button plus the floating panel it opens -
// so clicking the trigger itself isn't treated as an outside click and
// immediately reopening what it just closed.
export function useClickOutside(
  refs: ClickOutsideRef | ClickOutsideRef[],
  onOutsideClick: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const list = Array.isArray(refs) ? refs : [refs];

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = list.some((ref) => ref.current?.contains(target));
      if (!isInside) onOutsideClick();
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [refs, onOutsideClick, enabled]);
}
