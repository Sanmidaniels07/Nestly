"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { GOOGLE_CLIENT_ID, GoogleButtonOptions, loadGoogleIdentity } from "@/src/lib/google";

interface Props {
  /** Called with Google's ID token once the person picks their account. */
  onCredential: (credential: string) => void;
  text?: GoogleButtonOptions["text"];
  /** Covers the button while the credential is being sent to Nestly. */
  busy?: boolean;
}

// Google's own "Continue with Google" button (Google requires its official
// button for this sign-in). It opens Google's account picker in a popup.
export default function GoogleButton({ onCredential, text = "continue_with", busy }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    callback.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let cancelled = false;

    loadGoogleIdentity()
      .then((google) => {
        const el = ref.current;
        if (cancelled || !el) return;

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) callback.current(response.credential);
          },
          ux_mode: "popup",
          auto_select: false,
          context: text === "signup_with" ? "signup" : "signin",
          itp_support: true,
        });

        el.innerHTML = "";
        google.accounts.id.renderButton(el, {
          type: "standard",
          theme: resolvedTheme === "dark" ? "filled_black" : "outline",
          size: "large",
          text,
          shape: "pill",
          logo_alignment: "center",
          // Google allows 200-400px.
          width: Math.max(200, Math.min(400, Math.floor(el.offsetWidth))),
        });
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
    };
  }, [resolvedTheme, text]);

  if (failed) {
    return (
      <p className="rounded-2xl border border-line bg-surface-sunken px-4 py-3 text-center text-[12.5px] text-muted">
        Google sign-in couldn&apos;t load. Check your connection, or use your email below.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Fixed height so the page doesn't jump when Google's button appears. */}
      <div ref={ref} className="flex h-11 w-full justify-center overflow-hidden" />
      {busy && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-surface/80 text-[13px] font-medium text-muted">
          Signing you in…
        </div>
      )}
    </div>
  );
}
