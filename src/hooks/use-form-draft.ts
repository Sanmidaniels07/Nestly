"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "./use-auth";

// Keeps what someone typed into a form in this browser, so a refresh, a
// closed tab or logging out and back in brings them back where they left off.
//   - Saved per account (and per form), so someone else signing in on the
//     same phone never sees it. Forms used without an account (paying
//     through a link) can opt in with `guest`.
//   - Kept for 30 days; cleared when the form is submitted (call clear()).
//   - Never pass secrets in `value` (passwords, codes, bank account numbers) -
//     strip them before calling.
// Edit forms: pass `ready` once the saved item has loaded into the form, and
// `isEmpty` as "same as the saved item", so only real unsaved changes are kept.

const PREFIX = "nestly:draft:v1:";
const KEEP_MS = 30 * 24 * 60 * 60 * 1000;
const SAVE_AFTER_MS = 500;

interface Stored<T> {
  at: number;
  value: T;
}

const read = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Stored<T>;
    if (!stored || typeof stored.at !== "number" || Date.now() - stored.at > KEEP_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return stored.value;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), value }));
  } catch {
    // Storage full or blocked (private mode) - the draft just isn't kept.
  }
};

const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

/** Removes a saved draft directly (e.g. after a submit that happens outside the form). */
export const clearFormDraft = (ownerId: string, formKey: string) => remove(`${PREFIX}${ownerId}:${formKey}`);

export interface FormDraftOptions<T> {
  /** False until the form has its starting values (edit forms: the saved item loaded). */
  ready?: boolean;
  /** Nothing worth keeping - the saved draft is removed instead. */
  isEmpty?: (value: T) => boolean;
  /** Also keep drafts for people who aren't signed in (shared "guest" slot). */
  guest?: boolean;
}

export function useFormDraft<T>(
  formKey: string | null,
  value: T,
  onRestore: (saved: T) => void,
  { ready = true, isEmpty, guest = false }: FormDraftOptions<T> = {}
) {
  const { user, isHydrated } = useAuth();
  const owner = user?.id ?? (guest && isHydrated ? "guest" : null);
  const storageKey = isHydrated && owner && formKey ? `${PREFIX}${owner}:${formKey}` : null;

  const [restored, setRestored] = useState(false);
  const loadedKey = useRef<string | null>(null);
  const skipValue = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Latest callbacks, without making the effects below re-run on every render.
  const restoreRef = useRef(onRestore);
  const emptyRef = useRef(isEmpty);
  useEffect(() => {
    restoreRef.current = onRestore;
    emptyRef.current = isEmpty;
  });

  // Bring back a saved draft once per form, when the form is ready.
  useEffect(() => {
    if (!storageKey || !ready || loadedKey.current === storageKey) return;
    loadedKey.current = storageKey;
    const saved = read<T>(storageKey);
    if (saved !== null) {
      restoreRef.current(saved);
      // Browser storage can only be read after mount, so this has to be an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestored(true);
    }
  }, [storageKey, ready]);

  // Save changes shortly after typing stops.
  const serialized = JSON.stringify(value);
  useEffect(() => {
    if (!storageKey || loadedKey.current !== storageKey) return;
    if (skipValue.current !== null) {
      if (skipValue.current === serialized) return;
      skipValue.current = null;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const current = JSON.parse(serialized) as T;
      if (emptyRef.current?.(current)) remove(storageKey);
      else write(storageKey, current);
    }, SAVE_AFTER_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [storageKey, serialized]);

  /** Forget the draft (after a successful submit, or "Start over"). */
  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (storageKey) remove(storageKey);
    skipValue.current = serialized;
    setRestored(false);
  }, [storageKey, serialized]);

  return { restored, clear, dismissNotice: () => setRestored(false) };
}
