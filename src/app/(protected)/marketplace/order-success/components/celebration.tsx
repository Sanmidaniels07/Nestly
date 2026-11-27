"use client";

import { motion, useReducedMotion } from "framer-motion";

// Nestly colours for the confetti.
const COLOURS = ["#7c3aed", "#6366f1", "#a78bfa", "#f59e0b", "#10b981", "#f472b6", "#ffffff"];

// Fixed pseudo-random pieces (same on every render, so no flicker).
const PIECES = Array.from({ length: 42 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin((i + 1) * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  return {
    left: 8 + r(1) * 84,
    drift: (r(2) - 0.5) * 220,
    rise: 120 + r(3) * 160,
    fall: 260 + r(4) * 220,
    rotate: (r(5) - 0.5) * 900,
    delay: r(6) * 0.25,
    size: 6 + r(7) * 7,
    round: r(8) > 0.6,
    colour: COLOURS[i % COLOURS.length],
  };
});

// A short burst of confetti over the hero, once. Skipped when the person has
// asked their phone or computer for less motion.
export function Confetti() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((piece, i) => (
        <motion.span
          key={i}
          className="absolute top-[38%] block"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.round ? piece.size : piece.size * 0.45,
            borderRadius: piece.round ? 999 : 2,
            background: piece.colour,
          }}
          initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -piece.rise, piece.fall],
            x: [0, piece.drift * 0.6, piece.drift],
            rotate: piece.rotate,
          }}
          transition={{ duration: 2.2, delay: 0.35 + piece.delay, ease: [0.15, 0.7, 0.4, 1], times: [0, 0.12, 0.85, 1] }}
        />
      ))}
    </div>
  );
}

// The tick draws itself inside a soft, pulsing ring.
export function AnimatedTick() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-white/25"
          initial={{ scale: 0.6, opacity: 0.9 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
        />
      )}
      <motion.span
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-violet-600 shadow-[0_18px_40px_-12px_rgba(30,10,80,0.55)]"
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" aria-hidden>
          <motion.path
            d="M11 21.5 L17.5 28 L29.5 14"
            stroke="currentColor"
            strokeWidth={4.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
      </motion.span>
    </div>
  );
}
