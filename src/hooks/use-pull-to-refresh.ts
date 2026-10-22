"use client";

import { useEffect, useRef, useState } from "react";

const THRESHOLD = 72; // px of (resisted) pull needed to trigger a refresh
const MAX_PULL = 110;

/**
 * Pull-down-to-refresh for touch screens, at the very top of the page.
 * Returns how far the user has pulled (to draw an indicator) and whether a
 * refresh is running. Also stops Chrome's own pull-to-reload while active,
 * which would otherwise reload the whole app.
 */
export function usePullToRefresh(onRefresh: () => Promise<unknown>) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);
  const busy = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    const body = document.body;
    const previous = body.style.overscrollBehaviorY;
    body.style.overscrollBehaviorY = "contain";

    const onStart = (e: TouchEvent) => {
      startY.current = window.scrollY <= 0 && !busy.current ? e.touches[0].clientY : null;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0 || window.scrollY > 0) {
        pullRef.current = 0;
        setPull(0);
        return;
      }
      // Resistance: the further you pull, the slower it moves.
      const resisted = Math.min(MAX_PULL, dy * 0.5);
      pullRef.current = resisted;
      setPull(resisted);
    };
    const onEnd = async () => {
      if (startY.current === null) return;
      startY.current = null;
      const shouldRefresh = pullRef.current >= THRESHOLD;
      pullRef.current = 0;
      setPull(0);
      if (!shouldRefresh) return;
      busy.current = true;
      setRefreshing(true);
      try {
        await onRefreshRef.current();
      } finally {
        busy.current = false;
        setRefreshing(false);
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      body.style.overscrollBehaviorY = previous;
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return { pull, refreshing, ready: pull >= THRESHOLD, threshold: THRESHOLD };
}
