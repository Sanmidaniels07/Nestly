import { api } from "./axios";

// Push notifications on this device (public/sw.js shows them). The device
// is tied to whoever is signed in: PushSync re-links it after each sign-in
// and logging out turns it off, so one person's alerts never reach the
// next person on the same phone.

export type PushState =
  | "unsupported" // this browser can't do push
  | "needs-home-screen" // iPhone/iPad in Safari: add to Home Screen first
  | "unavailable" // the server has no push keys yet
  | "blocked" // the person said no in the browser
  | "off"
  | "on";

export const pushSupported = () =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

const isIos = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

// iPhones only allow push for sites added to the Home Screen.
export const needsHomeScreen = () => typeof window !== "undefined" && isIos() && !isStandalone();

let publicKey: Promise<string | null> | null = null;
const getPublicKey = () => {
  publicKey ??= api
    .get<{ data: { publicKey: string | null } }>("/push/config")
    .then((response) => response.data.data.publicKey)
    .catch(() => {
      publicKey = null;
      return null;
    });
  return publicKey;
};

const toBytes = (base64: string) => {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

const sameKey = (subscription: PushSubscription, key: Uint8Array) => {
  const current = subscription.options.applicationServerKey;
  if (!current) return false;
  const bytes = new Uint8Array(current);
  return bytes.length === key.length && bytes.every((byte, i) => byte === key[i]);
};

// The API address lets the alert's "Mark as read" button reach the server.
const registration = () =>
  navigator.serviceWorker.register(`/sw.js?api=${encodeURIComponent(process.env.NEXT_PUBLIC_API_URL ?? "")}`);

const existingSubscription = async () => {
  const reg = await navigator.serviceWorker.getRegistration("/");
  return (await reg?.pushManager.getSubscription()) ?? null;
};

export const getPushState = async (): Promise<PushState> => {
  if (!pushSupported()) return needsHomeScreen() ? "needs-home-screen" : "unsupported";
  if (Notification.permission === "denied") return "blocked";
  if (!(await getPublicKey())) return "unavailable";
  return Notification.permission === "granted" && (await existingSubscription()) ? "on" : "off";
};

/** Subscribes this device (permission already granted) and links it to the signed-in user. */
const subscribeAndSave = async () => {
  const key = await getPublicKey();
  if (!key) return false;
  const serverKey = toBytes(key);
  const reg = await registration();
  await navigator.serviceWorker.ready;

  let subscription = await reg.pushManager.getSubscription();
  // Subscribed with another key (keys changed) - start again.
  if (subscription && !sameKey(subscription, serverKey)) {
    await subscription.unsubscribe();
    subscription = null;
  }
  subscription ??= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: serverKey });

  await api.post("/push/subscriptions", subscription.toJSON());
  return true;
};

/** "Turn on notifications": asks the browser, then subscribes. */
export const enablePush = async (): Promise<PushState> => {
  if (!pushSupported()) return needsHomeScreen() ? "needs-home-screen" : "unsupported";
  const permission = await Notification.requestPermission();
  if (permission === "denied") return "blocked";
  if (permission !== "granted") return "off";
  return (await subscribeAndSave()) ? "on" : "unavailable";
};

/** Turns push off on this device. `tellServer: false` when already signed out. */
export const disablePush = async ({ tellServer = true }: { tellServer?: boolean } = {}) => {
  if (!pushSupported()) return;
  // A sign-in sync still saving would otherwise re-add the device afterwards.
  if (syncing) await syncing;
  const subscription = await existingSubscription();
  if (!subscription) return;
  if (tellServer) await api.delete("/push/subscriptions", { data: { endpoint: subscription.endpoint } }).catch(() => {});
  await subscription.unsubscribe().catch(() => {});
};

let syncing: Promise<unknown> | null = null;

/** After sign-in: if this device already allowed notifications, link it to this user. */
export const syncPush = async () => {
  if (!pushSupported() || Notification.permission !== "granted") return;
  // One at a time - a second call joins the one in progress.
  syncing ??= subscribeAndSave()
    .catch((error) => console.warn("Push sync failed:", error))
    .finally(() => {
      syncing = null;
    });
  await syncing;
};

export const sendTestPush = () => api.post("/push/test");

/** The unread number on the installed app's icon; 0 clears it. */
export const setAppIconBadge = (count: number) => {
  if (typeof navigator === "undefined" || !("setAppBadge" in navigator)) return;
  (count > 0 ? navigator.setAppBadge(count) : navigator.clearAppBadge()).catch(() => {});
};
