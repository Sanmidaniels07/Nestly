"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { PushState, disablePush, enablePush, getPushState, sendTestPush } from "../lib/push";

// This device's push notification state, with turn on / off / test.
export const usePush = () => {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPushState().then((next) => !cancelled && setState(next));
    return () => {
      cancelled = true;
    };
  }, []);

  const turnOn = useCallback(async () => {
    setBusy(true);
    try {
      const next = await enablePush();
      setState(next);
      if (next === "on") toast.success("Notifications are on for this device");
      if (next === "blocked") toast.error("Notifications are blocked for Nestly in this browser's settings");
      return next;
    } catch {
      toast.error("Couldn't turn on notifications. Please try again.");
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const turnOff = useCallback(async () => {
    setBusy(true);
    try {
      await disablePush();
      setState("off");
      toast.success("Notifications are off for this device");
    } finally {
      setBusy(false);
    }
  }, []);

  const test = useCallback(async () => {
    setBusy(true);
    try {
      await sendTestPush();
      toast.success("Sent - it should pop up in a moment");
    } catch {
      toast.error("Couldn't send a test notification");
    } finally {
      setBusy(false);
    }
  }, []);

  return { state, busy, turnOn, turnOff, test };
};
