"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";

// Keeps a live running while someone uses the rest of the app. The live
// screen (viewer or seller) is drawn by <LiveDock /> at the top of the app,
// not by the page, so it stays connected when the page changes; the page
// just asks the dock to open it. Leaving the live's page shrinks it to a
// small floating window; tapping that window brings it back full screen.

export type DockTarget = { kind: "viewer"; code: string } | { kind: "host"; id: string };

export const dockPath = (target: DockTarget) => (target.kind === "viewer" ? `/live/${target.code}` : `/marketplace/live/${target.id}`);

const sameTarget = (a: DockTarget | null, b: DockTarget | null) =>
  !!a && !!b && a.kind === b.kind && (a.kind === "viewer" ? a.code === (b as typeof a).code : a.id === (b as typeof a).id);

interface LiveDock {
  target: DockTarget | null;
  minimized: boolean;
  // The seller is broadcasting from the dock (so it mustn't be replaced).
  hosting: boolean;
  open: (target: DockTarget) => void;
  /** Shrink to the floating window - only if this live is the one in the dock. */
  minimize: (target: DockTarget) => void;
  /** Close it - only if this live is the one in the dock. */
  close: (target: DockTarget) => void;
  setHosting: (hosting: boolean) => void;
}

const LiveDockContext = createContext<LiveDock | null>(null);

export function LiveDockProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<DockTarget | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [hosting, setHosting] = useState(false);
  // The live in the dock right now, readable straight after a change.
  const current = useRef<DockTarget | null>(null);

  const open = useCallback((next: DockTarget) => {
    if (!sameTarget(current.current, next)) {
      current.current = next;
      setTarget(next);
    }
    setMinimized(false);
  }, []);

  const minimize = useCallback((which: DockTarget) => {
    if (sameTarget(current.current, which)) setMinimized(true);
  }, []);

  const close = useCallback((which: DockTarget) => {
    if (!sameTarget(current.current, which)) return;
    current.current = null;
    setTarget(null);
    setMinimized(false);
    setHosting(false);
  }, []);

  const value = useMemo(() => ({ target, minimized, hosting, open, minimize, close, setHosting }), [target, minimized, hosting, open, minimize, close]);
  return <LiveDockContext.Provider value={value}>{children}</LiveDockContext.Provider>;
}

export function useLiveDock() {
  const dock = useContext(LiveDockContext);
  if (!dock) throw new Error("useLiveDock must be used inside LiveDockProvider");
  return dock;
}
