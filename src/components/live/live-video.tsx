"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  ConnectionState,
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
  VideoPresets,
  createLocalTracks,
} from "livekit-client";
import { Loader2, VideoOff, Volume2 } from "lucide-react";

// Live video on LiveKit. Viewers subscribe to the seller's camera and mic;
// the seller previews their camera, then publishes it once they go live.
// The video fills a portrait (phone-shaped) frame.

type VideoState = "connecting" | "waiting" | "playing" | "reconnecting" | "ended" | "error";

// ---------------------------------------------------------------------------
// Viewer
// ---------------------------------------------------------------------------

export function ViewerVideo({ url, token, onState }: { url: string; token: string; onState?: (state: VideoState) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roomRef = useRef<Room | null>(null);
  const [state, setState] = useState<VideoState>("connecting");
  const [needsTap, setNeedsTap] = useState(false);

  const update = useCallback(
    (next: VideoState) => {
      setState(next);
      onState?.(next);
    },
    [onState]
  );

  useEffect(() => {
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;
    let cancelled = false;

    const attach = (track: RemoteTrack) => {
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
        update("playing");
      }
      if (track.kind === Track.Kind.Audio && audioRef.current) {
        track.attach(audioRef.current);
        setNeedsTap(!room.canPlaybackAudio);
      }
    };

    room
      .on(RoomEvent.TrackSubscribed, (track) => attach(track))
      .on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach();
        if (track.kind === Track.Kind.Video) update("waiting");
      })
      .on(RoomEvent.AudioPlaybackStatusChanged, () => setNeedsTap(!room.canPlaybackAudio))
      .on(RoomEvent.Reconnecting, () => update("reconnecting"))
      .on(RoomEvent.Reconnected, () => update(room.remoteParticipants.size ? "playing" : "waiting"))
      .on(RoomEvent.Disconnected, () => {
        if (!cancelled) update("ended");
      });

    room
      .connect(url, token)
      .then(() => {
        if (cancelled) return;
        // Tracks published before we joined arrive as TrackSubscribed too;
        // if the seller isn't publishing yet, wait for them.
        const hasVideo = [...room.remoteParticipants.values()].some((p) =>
          [...p.trackPublications.values()].some((pub) => pub.kind === Track.Kind.Video && pub.track)
        );
        if (!hasVideo) update("waiting");
      })
      .catch(() => {
        if (!cancelled) update("error");
      });

    return () => {
      cancelled = true;
      room.disconnect();
      roomRef.current = null;
    };
  }, [url, token, update]);

  return (
    <div className="absolute inset-0 bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
      <audio ref={audioRef} autoPlay />
      {state !== "playing" && <VideoOverlay state={state} />}
      {needsTap && state === "playing" && (
        <button
          type="button"
          onClick={() => roomRef.current?.startAudio().then(() => setNeedsTap(false))}
          className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-black/60 px-5 py-3 text-[14px] font-semibold text-white backdrop-blur"
        >
          <Volume2 size={18} /> Tap for sound
        </button>
      )}
    </div>
  );
}

function VideoOverlay({ state }: { state: VideoState }) {
  const copy: Record<Exclude<VideoState, "playing">, string> = {
    connecting: "Joining the live…",
    waiting: "Waiting for the seller's camera…",
    reconnecting: "Reconnecting…",
    ended: "The video has stopped",
    error: "Couldn't load the video. Check your connection and refresh.",
  };
  const busy = state === "connecting" || state === "waiting" || state === "reconnecting";
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-zinc-900 to-black px-8 text-center text-white/80">
      {busy ? <Loader2 size={26} className="animate-spin" /> : <VideoOff size={26} />}
      <p className="text-[13.5px]">{copy[state as Exclude<VideoState, "playing">]}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seller (host)
// ---------------------------------------------------------------------------

export interface HostVideoHandle {
  flipCamera: () => Promise<void>;
  setMicOn: (on: boolean) => Promise<void>;
}

interface HostVideoProps {
  // Set once the seller goes live: the camera is published to this room.
  session: { url: string; token: string } | null;
  onError?: (message: string) => void;
  onConnection?: (state: "offline" | "connecting" | "live" | "reconnecting") => void;
}

export const HostVideo = forwardRef<HostVideoHandle, HostVideoProps>(function HostVideo({ session, onError, onConnection }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tracksRef = useRef<{ video: LocalVideoTrack | null; audio: LocalAudioTrack | null }>({ video: null, audio: null });
  const facing = useRef<"user" | "environment">("user");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  // The front camera is shown mirrored (like a selfie); viewers see it the right way round.
  const [mirrored, setMirrored] = useState(true);

  const handlers = useRef({ onError, onConnection });
  useEffect(() => {
    handlers.current = { onError, onConnection };
  });

  // Camera + mic preview, from the moment the studio opens.
  useEffect(() => {
    let stopped = false;
    const tracks = tracksRef.current;
    createLocalTracks({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: { facingMode: "user", resolution: VideoPresets.h720.resolution },
    })
      .then((created) => {
        if (stopped) return created.forEach((track) => track.stop());
        for (const track of created) {
          if (track.kind === Track.Kind.Video) {
            tracks.video = track as LocalVideoTrack;
            if (videoRef.current) track.attach(videoRef.current);
          } else {
            tracks.audio = track as LocalAudioTrack;
          }
        }
        setCameraReady(true);
      })
      .catch(() => {
        const message = "We couldn't use your camera and microphone. Allow access in your browser settings, then refresh.";
        setCameraError(message);
        handlers.current.onError?.(message);
      });
    return () => {
      stopped = true;
      tracks.video?.stop();
      tracks.audio?.stop();
    };
  }, []);

  // Publish once live.
  useEffect(() => {
    if (!session || !cameraReady) return;
    const room = new Room({ adaptiveStream: false, dynacast: true });
    let cancelled = false;
    handlers.current.onConnection?.("connecting");

    room
      .on(RoomEvent.Reconnecting, () => handlers.current.onConnection?.("reconnecting"))
      .on(RoomEvent.Reconnected, () => handlers.current.onConnection?.("live"))
      .on(RoomEvent.Disconnected, () => {
        if (!cancelled) handlers.current.onConnection?.("offline");
      });

    room
      .connect(session.url, session.token)
      .then(async () => {
        if (cancelled) return;
        const { video, audio } = tracksRef.current;
        if (video) await room.localParticipant.publishTrack(video, { simulcast: true, source: Track.Source.Camera });
        if (audio) await room.localParticipant.publishTrack(audio, { source: Track.Source.Microphone });
        if (room.state === ConnectionState.Connected) handlers.current.onConnection?.("live");
      })
      .catch(() => {
        if (!cancelled) {
          handlers.current.onConnection?.("offline");
          handlers.current.onError?.("Couldn't connect your video. Check your connection and try again.");
        }
      });

    return () => {
      cancelled = true;
      // Unpublish without stopping the camera - the preview keeps running.
      room.disconnect(false);
    };
  }, [session, cameraReady]);

  useImperativeHandle(ref, () => ({
    flipCamera: async () => {
      facing.current = facing.current === "user" ? "environment" : "user";
      await tracksRef.current.video?.restartTrack({ facingMode: facing.current, resolution: VideoPresets.h720.resolution });
      setMirrored(facing.current === "user");
    },
    setMicOn: async (on: boolean) => {
      if (on) await tracksRef.current.audio?.unmute();
      else await tracksRef.current.audio?.mute();
    },
  }));

  return (
    <div className="absolute inset-0 bg-black">
      <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${mirrored ? "-scale-x-100" : ""}`} />
      {!cameraReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center text-white/80">
          {cameraError ? <VideoOff size={26} /> : <Loader2 size={26} className="animate-spin" />}
          <p className="text-[13.5px]">{cameraError || "Starting your camera…"}</p>
        </div>
      )}
    </div>
  );
});
