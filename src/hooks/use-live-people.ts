"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Participant, Room, RoomEvent, Track, TrackPublication, VideoPresets } from "livekit-client";
import toast from "react-hot-toast";

import { isHostIdentity } from "../components/live/live-video";

// The people in a live, the way a meeting shows them: who's here, who's
// talking, whose mic / camera is on, and what each buyer is allowed to turn
// on. Also the buyer's own mic and camera buttons. Guests watch hidden, so
// they're not in this list.

// LiveKit's track source numbers (TrackSource in the protocol).
const SOURCE_CAMERA = 1;
const SOURCE_MICROPHONE = 2;

export interface LivePerson {
  identity: string;
  // Nestly user id for buyers (null for the seller).
  userId: string | null;
  name: string;
  avatar: string | null;
  isHost: boolean;
  isLocal: boolean;
  micOn: boolean;
  camOn: boolean;
  speaking: boolean;
  videoTrack: Track | null;
  joinedAt: Date | null;
  // What they're allowed to turn on (the seller can do everything).
  canMic: boolean;
  canCam: boolean;
}

const sourceOn = (publication: TrackPublication | undefined) => !!publication && !publication.isMuted && (!!publication.track || publication.isSubscribed);

const toPerson = (participant: Participant, isLocal: boolean): LivePerson => {
  const isHost = isHostIdentity(participant.identity);
  let avatar: string | null = null;
  try {
    avatar = participant.metadata ? (JSON.parse(participant.metadata).avatar ?? null) : null;
  } catch {
    // Not JSON - no avatar.
  }
  const mic = participant.getTrackPublication(Track.Source.Microphone);
  const cam = participant.getTrackPublication(Track.Source.Camera);
  const sources = participant.permissions?.canPublishSources ?? [];
  const canPublish = participant.permissions?.canPublish ?? false;
  return {
    identity: participant.identity,
    userId: participant.identity.startsWith("user_") ? participant.identity.slice(5) : null,
    name: participant.name || "Someone",
    avatar,
    isHost,
    isLocal,
    micOn: sourceOn(mic),
    camOn: sourceOn(cam) && !!cam?.track,
    speaking: participant.isSpeaking,
    videoTrack: cam?.track && !cam.isMuted ? cam.track : null,
    joinedAt: participant.joinedAt ?? null,
    canMic: isHost || (canPublish && (sources.length === 0 || sources.includes(SOURCE_MICROPHONE))),
    canCam: isHost || (canPublish && (sources.length === 0 || sources.includes(SOURCE_CAMERA))),
  };
};

const ROOM_EVENTS = [
  RoomEvent.ParticipantConnected,
  RoomEvent.ParticipantDisconnected,
  RoomEvent.TrackSubscribed,
  RoomEvent.TrackUnsubscribed,
  RoomEvent.TrackPublished,
  RoomEvent.TrackUnpublished,
  RoomEvent.TrackMuted,
  RoomEvent.TrackUnmuted,
  RoomEvent.LocalTrackPublished,
  RoomEvent.LocalTrackUnpublished,
  RoomEvent.ActiveSpeakersChanged,
  RoomEvent.ParticipantPermissionsChanged,
  RoomEvent.ParticipantMetadataChanged,
  RoomEvent.ConnectionStateChanged,
] as const;

export function useLivePeople(room: Room | null, { onJoin }: { onJoin?: (person: LivePerson) => void } = {}) {
  const [people, setPeople] = useState<LivePerson[]>([]);
  // Set while this person is changing their own mic / camera, so a mute from
  // the seller can be told apart (and explained).
  const selfChange = useRef(false);
  const handlers = useRef({ onJoin });
  useEffect(() => {
    handlers.current = { onJoin };
  });

  useEffect(() => {
    if (!room) return;
    const refresh = () =>
      setPeople([toPerson(room.localParticipant, true), ...[...room.remoteParticipants.values()].map((participant) => toPerson(participant, false))]);

    const onConnected = (participant: Participant) => handlers.current.onJoin?.(toPerson(participant, false));
    const onMuted = (publication: TrackPublication, participant: Participant) => {
      if (participant !== room.localParticipant || selfChange.current) return;
      if (publication.source === Track.Source.Microphone) toast("The seller muted your mic", { icon: "🔇" });
      if (publication.source === Track.Source.Camera) toast("The seller turned off your camera", { icon: "📷" });
    };
    const onPermissions = (_previous: unknown, participant: Participant) => {
      if (participant !== room.localParticipant) return;
      const me = toPerson(participant, true);
      if (!me.canMic && !me.canCam) toast("The seller has turned off mics and cameras for you for now.");
    };

    ROOM_EVENTS.forEach((event) => room.on(event, refresh));
    room.on(RoomEvent.ParticipantConnected, onConnected);
    room.on(RoomEvent.TrackMuted, onMuted);
    room.on(RoomEvent.ParticipantPermissionsChanged, onPermissions);
    refresh();
    return () => {
      ROOM_EVENTS.forEach((event) => room.off(event, refresh));
      room.off(RoomEvent.ParticipantConnected, onConnected);
      room.off(RoomEvent.TrackMuted, onMuted);
      room.off(RoomEvent.ParticipantPermissionsChanged, onPermissions);
    };
  }, [room]);

  // Nobody until the room is connected (and nobody after leaving it).
  const list = room ? people : [];
  const me = list.find((person) => person.isLocal) ?? null;

  const change = useCallback(
    async (source: "microphone" | "camera", on: boolean) => {
      if (!room) return;
      selfChange.current = true;
      try {
        if (source === "microphone") {
          await room.localParticipant.setMicrophoneEnabled(on, { echoCancellation: true, noiseSuppression: true, autoGainControl: true });
        } else {
          // Small and light for buyers' cameras - most people are on mobile data.
          await room.localParticipant.setCameraEnabled(on, { resolution: VideoPresets.h360.resolution, facingMode: "user" }, { simulcast: true });
        }
      } catch (error) {
        const denied = (error as Error)?.name === "NotAllowedError";
        toast.error(
          denied
            ? `Allow ${source === "microphone" ? "microphone" : "camera"} access in your browser settings, then try again.`
            : `Couldn't turn your ${source === "microphone" ? "mic" : "camera"} ${on ? "on" : "off"}.`
        );
      } finally {
        selfChange.current = false;
      }
    },
    [room]
  );

  return { people: list, me, setMic: (on: boolean) => change("microphone", on), setCamera: (on: boolean) => change("camera", on) };
}
