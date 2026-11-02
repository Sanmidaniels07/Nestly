"use client";

import { useEffect, useState } from "react";

// Full-screen Nestly splash while the app restores your session - the API
// (Render) can take up to a minute to wake after being idle, and the page
// used to sit blank all that time. Rendered on the server too, so it shows
// before any JavaScript has loaded. The longer it takes, the more it says.
const MESSAGES = [
  { after: 0, text: "" },
  { after: 3, text: "Getting things ready..." },
  { after: 8, text: "Waking Nestly up - this can take up to a minute after a quiet spell." },
  { after: 25, text: "Almost there. Thanks for your patience." },
];
const TAKING_LONG = 60;

export default function AppSplash() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const message = [...MESSAGES].reverse().find((m) => seconds >= m.after)?.text ?? "";
  const slow = seconds >= 8;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas px-6"
    >
      <div className="splash-pop flex flex-col items-center">
        <NestlyMark />
        <p className="mt-5 font-[family-name:var(--font-fraunces)] text-[30px] italic leading-none text-ink">Nestly</p>
      </div>

      <div className="mt-8 h-[3px] w-40 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-500/15">
        <div className="splash-bar h-full w-1/3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
      </div>

      <p
        className={`mt-5 min-h-[40px] max-w-xs text-center text-[13px] leading-relaxed text-muted transition-opacity duration-500 ${
          message ? "opacity-100" : "opacity-0"
        }`}
      >
        {message}
      </p>

      {seconds >= TAKING_LONG && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-xl border border-line px-4 py-2 text-[13px] font-semibold text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
        >
          Taking too long? Try again
        </button>
      )}
      {!slow && <span className="sr-only">Loading Nestly</span>}
    </div>
  );
}

// The app icon's mark: a dot inside two dashed rings that turn in opposite
// directions, on the violet tile.
function NestlyMark() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 shadow-[0_18px_40px_-12px_rgba(109,40,217,0.55)]">
      <svg viewBox="0 0 100 100" className="h-[78px] w-[78px]" aria-hidden="true">
        <g className="splash-ring-outer" style={{ transformOrigin: "50px 50px" }}>
          <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" strokeDasharray="13 11" />
        </g>
        <g className="splash-ring-inner" style={{ transformOrigin: "50px 50px" }}>
          <circle cx="50" cy="50" r="24" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 8.85" />
        </g>
        <circle className="splash-dot" cx="50" cy="50" r="8.5" fill="white" style={{ transformOrigin: "50px 50px" }} />
      </svg>
    </div>
  );
}
