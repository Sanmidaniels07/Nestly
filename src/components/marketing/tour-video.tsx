"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Maximize2, Pause, Play } from "lucide-react";

const SRC = "/videos/nestly-tour.mp4";
const POSTER = "/videos/nestly-tour-poster.jpg";

/**
 * The silent product tour. Plays muted and on loop while it's on screen
 * (like an app-store preview), pauses when scrolled away, and waits for a
 * tap instead for people who prefer reduced motion. All text is on screen,
 * so there is no audio to caption.
 */
export default function TourVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce || userPaused) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce, userPaused]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  const fullscreen = () => {
    const video = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen().catch(() => {});
    else video.webkitEnterFullscreen?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      className="relative mx-auto max-w-5xl"
    >
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-gradient-to-r from-violet-400/30 via-fuchsia-300/25 to-sky-300/30 blur-2xl dark:from-violet-600/25 dark:via-fuchsia-600/15 dark:to-sky-600/20" />
      <div className="group relative overflow-hidden rounded-[28px] border border-line-strong bg-surface shadow-2xl">
        <video
          ref={ref}
          src={SRC}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={toggle}
          aria-label="A 70-second silent tour of Nestly: the feed, birthdays, communities, events, messages, the marketplace, delivery codes and the seller dashboard."
          className="block aspect-video w-full cursor-pointer bg-canvas"
        />

        {/* Big play button while paused */}
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play the Nestly tour"
            className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors hover:bg-black/10"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_20px_50px_rgba(124,58,237,.45)] transition-transform group-hover:scale-105">
              <Play size={30} className="ml-1 fill-white" />
            </span>
          </button>
        )}

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/40 to-transparent px-3 pb-3 pt-8 opacity-100 sm:px-4 sm:pt-10 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-transform hover:scale-105"
          >
            {playing ? <Pause size={17} className="fill-current" /> : <Play size={17} className="ml-0.5 fill-current" />}
          </button>
          <span className="hidden rounded-full bg-black/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur sm:inline-block">70-second tour · no sound needed</span>
          <button
            type="button"
            onClick={fullscreen}
            aria-label="Watch full screen"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-transform hover:scale-105"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
