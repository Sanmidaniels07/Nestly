"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Ban, Crown, Lock, Mic, MicOff, MoreVertical, Video, VideoOff } from "lucide-react";

import { LivePerson } from "@/src/hooks/use-live-people";
import { LiveStage } from "@/src/types/live";

// People in a live, meeting-style: tiles for buyers on mic / camera, the
// People list (with the seller's mute / camera controls), and "X joined".

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

const timeAgo = (date: Date | null, now: number) => {
  if (!date) return "";
  const minutes = Math.max(0, Math.floor((now - date.getTime()) / 60000));
  if (minutes < 1) return "just joined";
  if (minutes < 60) return `joined ${minutes} min ago`;
  return `joined ${Math.floor(minutes / 60)} h ago`;
};

function Avatar({ person, size }: { person: LivePerson; size: number }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500 font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {person.avatar ? <Image src={person.avatar} alt="" fill sizes={`${size}px`} className="object-cover" /> : initial(person.name)}
    </span>
  );
}

/** One person's tile: their camera, or their picture; mic-off icon; ring while talking. */
export function PersonTile({ person, className = "" }: { person: LivePerson; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const track = person.videoTrack;
    const element = videoRef.current;
    if (!track || !element) return;
    track.attach(element);
    return () => {
      track.detach(element);
    };
  }, [person.videoTrack]);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-zinc-800 ring-2 transition-shadow ${person.speaking && person.micOn ? "ring-emerald-400" : "ring-white/10"} ${className}`}
    >
      {person.videoTrack ? (
        <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${person.isLocal ? "-scale-x-100" : ""}`} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-zinc-700 to-zinc-900">
          <Avatar person={person} size={36} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1 pt-3 text-[10.5px] font-medium text-white">
        {!person.micOn && <MicOff size={11} className="shrink-0 text-rose-300" />}
        <span className="truncate">{person.isLocal ? "You" : person.name}</span>
      </div>
    </div>
  );
}

/** Buyers on mic or camera, as a strip of tiles over the video. */
export function PeopleStrip({ people, onOpen }: { people: LivePerson[]; onOpen?: () => void }) {
  const active = people.filter((person) => !person.isHost && (person.camOn || person.micOn));
  if (active.length === 0) return null;
  return (
    <div className="pointer-events-auto flex max-w-full gap-2 overflow-x-auto pb-1">
      {active.slice(0, 12).map((person) => (
        <button key={person.identity} type="button" onClick={onOpen} aria-label={`${person.name}${person.micOn ? ", speaking" : ""}`} className="shrink-0">
          <PersonTile person={person} className="h-[92px] w-[70px] sm:h-[124px] sm:w-[94px]" />
        </button>
      ))}
      {active.length > 12 && (
        <button type="button" onClick={onOpen} className="flex h-[92px] w-[70px] shrink-0 items-center justify-center rounded-xl bg-black/55 text-[12px] font-semibold text-white sm:h-[124px] sm:w-[94px]">
          +{active.length - 12}
        </button>
      )}
    </div>
  );
}

/** "Ada joined" pop-ups for the seller (newest last, each fades after a few seconds). */
export function useJoinPops() {
  const [pops, setPops] = useState<{ key: number; name: string }[]>([]);
  const counter = useRef(0);
  const add = (person: LivePerson) => {
    if (person.isHost) return;
    const key = ++counter.current;
    setPops((current) => [...current.slice(-2), { key, name: person.name }]);
    setTimeout(() => setPops((current) => current.filter((pop) => pop.key !== key)), 4000);
  };
  return { pops, add };
}

export function JoinPops({ pops }: { pops: { key: number; name: string }[] }) {
  if (pops.length === 0) return null;
  return (
    <div className="pointer-events-none space-y-1.5">
      {pops.map((pop) => (
        <p key={pop.key} className="live-pop w-fit max-w-full truncate rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur">
          👋 {pop.name} joined
        </p>
      ))}
    </div>
  );
}

type MediaAction = "off" | "block" | "allow";

interface PeopleListProps {
  people: LivePerson[];
  // Signed-out viewers aren't in the list (only counted).
  guests: number;
  // Seller controls (omit for viewers).
  host?: {
    stage: LiveStage | null;
    onMedia: (person: LivePerson, source: "microphone" | "camera", action: MediaAction) => void;
    onStage: (body: { muteAll?: boolean; mics?: "on" | "off"; cams?: "on" | "off" }) => void;
    onBlockChat: (person: LivePerson) => void;
  };
}

/** Everyone in the live; for the seller, with mute / camera controls. */
export function PeopleList({ people, guests, host }: PeopleListProps) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const [menu, setMenu] = useState<string | null>(null);

  // Seller first, then people talking / on camera, then everyone else (newest first).
  const sorted = [...people].sort((a, b) => {
    const rank = (p: LivePerson) => (p.isHost ? 0 : p.micOn || p.camOn ? 1 : 2);
    return rank(a) - rank(b) || (b.joinedAt?.getTime() ?? 0) - (a.joinedAt?.getTime() ?? 0);
  });
  const stage = host?.stage;
  const blockedFor = (person: LivePerson) => (person.userId && stage?.blocked[person.userId]) || [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {host && (
        <div className="space-y-2 border-b border-line p-3">
          <button type="button" onClick={() => host.onStage({ muteAll: true })} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-[13px] font-semibold text-white">
            <MicOff size={15} /> Mute everyone
          </button>
          <div className="grid grid-cols-2 gap-2">
            <Toggle label="Buyers can unmute" on={!stage?.micsOff} onChange={(on) => host.onStage({ mics: on ? "on" : "off" })} />
            <Toggle label="Buyers can use camera" on={!stage?.camsOff} onChange={(on) => host.onStage({ cams: on ? "on" : "off" })} />
          </div>
        </div>
      )}

      <ul className="min-h-0 flex-1 overflow-y-auto p-2">
        {sorted.map((person) => {
          const blocked = blockedFor(person);
          const isBuyer = !person.isHost && !!person.userId;
          return (
            <li key={person.identity} className="relative flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-2">
              <span className={`rounded-full ring-2 ${person.speaking && person.micOn ? "ring-emerald-400" : "ring-transparent"}`}>
                <Avatar person={person} size={36} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 truncate text-[13.5px] font-semibold text-ink">
                  <span className="truncate">{person.isLocal ? `${person.name} (you)` : person.name}</span>
                  {person.isHost && <Crown size={13} className="shrink-0 text-amber-500" aria-label="Seller" />}
                </span>
                <span className="block truncate text-[11.5px] text-muted">
                  {person.isHost ? "Seller" : timeAgo(person.joinedAt, now)}
                  {blocked.length > 0 && ` · ${blocked.length === 2 ? "mic & camera" : blocked[0] === "microphone" ? "mic" : "camera"} turned off by you`}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-muted">
                {person.micOn ? <Mic size={16} className="text-emerald-600" /> : <MicOff size={16} />}
                {person.camOn ? <Video size={16} className="text-emerald-600" /> : <VideoOff size={16} />}
              </span>
              {host && isBuyer && (
                <>
                  <button type="button" onClick={() => setMenu(menu === person.identity ? null : person.identity)} aria-label={`Options for ${person.name}`} className="rounded-lg p-1.5 text-muted hover:bg-surface-sunken">
                    <MoreVertical size={16} />
                  </button>
                  {menu === person.identity && (
                    <div className="absolute right-2 top-full z-20 mt-1 w-56 overflow-hidden rounded-xl border border-line bg-surface py-1 text-[13px] shadow-xl">
                      <MenuItem disabled={!person.micOn} icon={MicOff} label="Mute" onClick={() => host.onMedia(person, "microphone", "off")} close={() => setMenu(null)} />
                      <MenuItem disabled={!person.camOn} icon={VideoOff} label="Turn off camera" onClick={() => host.onMedia(person, "camera", "off")} close={() => setMenu(null)} />
                      {blocked.includes("microphone") ? (
                        <MenuItem icon={Mic} label="Let them unmute again" onClick={() => host.onMedia(person, "microphone", "allow")} close={() => setMenu(null)} />
                      ) : (
                        <MenuItem icon={Lock} label="Don't let them unmute" onClick={() => host.onMedia(person, "microphone", "block")} close={() => setMenu(null)} />
                      )}
                      {blocked.includes("camera") ? (
                        <MenuItem icon={Video} label="Let them use camera again" onClick={() => host.onMedia(person, "camera", "allow")} close={() => setMenu(null)} />
                      ) : (
                        <MenuItem icon={Lock} label="Don't let them use camera" onClick={() => host.onMedia(person, "camera", "block")} close={() => setMenu(null)} />
                      )}
                      <MenuItem icon={Ban} label="Block from this live" danger onClick={() => host.onBlockChat(person)} close={() => setMenu(null)} />
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
        {guests > 0 && <li className="px-2 py-3 text-[12px] text-muted">+ {guests} watching without an account</li>}
      </ul>
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex items-center justify-between gap-2 rounded-xl border border-line px-2.5 py-2 text-left text-[11.5px] font-medium leading-tight text-ink-2"
    >
      <span>{label}</span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-violet-600" : "bg-zinc-300 dark:bg-zinc-600"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  close,
  disabled,
  danger,
}: {
  icon: typeof Mic;
  label: string;
  onClick: () => void;
  close: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        onClick();
        close();
      }}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-surface-2 disabled:opacity-40 ${danger ? "text-red-600" : "text-ink"}`}
    >
      <Icon size={15} /> {label}
    </button>
  );
}
