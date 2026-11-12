"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";

import { useLive, useMyLives } from "@/src/hooks/use-lives";
import { PublicLive, SellerLive } from "@/src/types/live";
import { DockTarget, useLiveDock } from "./live-dock-context";
import { LiveNow } from "./live-now";
import { Studio } from "./studio";

// Draws whichever live is in the dock - full screen or as the floating mini
// window. Mounted once at the top of the app (see providers.tsx).

export default function LiveDock() {
  const { target } = useLiveDock();
  if (!target) return null;
  return target.kind === "viewer" ? <DockedViewer key={target.code} code={target.code} /> : <DockedHost key={target.id} id={target.id} />;
}

function DockedViewer({ code }: { code: string }) {
  const { close } = useLiveDock();
  const { data: live, isError } = useLive(code);
  const over = isError || (!!live && live.status !== "LIVE");

  useEffect(() => {
    if (over) close({ kind: "viewer", code });
  }, [over, close, code]);

  if (!live || over) return null;
  return <LiveNow live={live} />;
}

function DockedHost({ id }: { id: string }) {
  const { close } = useLiveDock();
  const { data, isError } = useMyLives();
  const live = data?.lives.find((item) => item.id === id);
  const over = isError || (!!data && (!live || (live.status !== "LIVE" && live.status !== "SCHEDULED")));

  useEffect(() => {
    if (over) close({ kind: "host", id });
  }, [over, close, id]);

  if (!live || over) return null;
  return <Studio live={live} />;
}

// ---------------------------------------------------------------------------
// Used by the pages
// ---------------------------------------------------------------------------

/**
 * Put this live in the dock while its page is open. Leaving the page shrinks
 * it to the mini window - or closes it if nothing is being broadcast yet
 * (a seller still on the preview).
 */
function useDockWhileOpen(target: DockTarget, keepWhenLeaving: boolean) {
  const { open, minimize, close } = useLiveDock();
  const key = target.kind === "viewer" ? `v:${target.code}` : `h:${target.id}`;
  // Read when the page is left, not when it changes (going live flips it).
  const keep = useRef(keepWhenLeaving);
  useEffect(() => {
    keep.current = keepWhenLeaving;
  }, [keepWhenLeaving]);

  useEffect(() => {
    open(target);
    return () => (keep.current ? minimize(target) : close(target));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the key identifies the target
  }, [key, open, minimize, close]);
}

/** The /live/{code} page while the live is on. */
export function DockedLive({ live }: { live: PublicLive }) {
  const { target, hosting } = useLiveDock();
  // A seller broadcasting their own live can't watch another one at the same time.
  const busyHosting = hosting && target?.kind === "host";
  if (busyHosting) return <HostingNotice studioId={target.id} />;
  return <DockViewerWhileOpen code={live.code} />;
}

function DockViewerWhileOpen({ code }: { code: string }) {
  useDockWhileOpen({ kind: "viewer", code }, true);
  return <div className="fixed inset-0 bg-[#0c0c10]" />;
}

/** The studio page while the live is scheduled or on. */
export function DockedStudio({ live }: { live: SellerLive }) {
  useDockWhileOpen({ kind: "host", id: live.id }, live.status === "LIVE");
  return <div className="fixed inset-0 bg-[#0c0c10]" />;
}

function HostingNotice({ studioId }: { studioId: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
        <Radio size={22} />
      </span>
      <p className="text-[16px] font-semibold text-ink">You&apos;re live right now</p>
      <p className="mt-1.5 text-[13.5px] text-muted">End your own live before watching another one.</p>
      <Link href={`/marketplace/live/${studioId}`} className="mt-6 inline-flex h-11 items-center rounded-xl bg-violet-600 px-5 text-[13.5px] font-semibold text-white">
        Back to your live
      </Link>
    </div>
  );
}
