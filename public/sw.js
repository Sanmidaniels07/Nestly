// Nestly service worker: shows push notifications (messages, orders, likes
// and every other alert) - even while Nestly is open - and opens the right page
// when one is tapped. Pushes come from the API (utils/webPush) as
// { title, body, url, tag, urgent, id, readToken, type, unread }.
// No caching or offline behaviour.
//
// Registered as /sw.js?api=<API base URL> (src/lib/push.ts) so "Mark as read"
// can reach the API.

const API = (() => {
  try {
    const api = new URL(self.location).searchParams.get("api");
    return api ? new URL(api).href.replace(/\/$/, "") : null;
  } catch {
    return null;
  }
})();

// The number on the installed app's icon (Android, iPhone, laptop).
const setBadge = (count) => {
  if (typeof count !== "number" || !self.navigator.setAppBadge) return Promise.resolve();
  return (count > 0 ? self.navigator.setAppBadge(count) : self.navigator.clearAppBadge()).catch(() => {});
};

// Buttons under the alert (Android and laptops; iPhone shows none).
const actionsFor = (type, canMarkRead) => {
  if (type === "MESSAGE") return [{ action: "open", title: "Reply" }, ...(canMarkRead ? [{ action: "read", title: "Mark as read" }] : [])];
  if (type === "ORDER") return [{ action: "open", title: "View order" }];
  return canMarkRead ? [{ action: "read", title: "Mark as read" }] : [];
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const canMarkRead = !!(API && data.id && data.readToken);

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title || "Nestly", {
        body: data.body || "",
        icon: "/icon.png",
        // Small white Nestly mark in the Android status bar.
        badge: "/badge.png",
        // Same tag replaces the earlier alert (e.g. one per chat) and still
        // buzzes the phone.
        tag: data.tag,
        renotify: !!data.tag,
        // Messages and orders buzz harder than likes and follows.
        vibrate: data.urgent ? [250, 100, 250, 100, 250] : [150],
        actions: actionsFor(data.type, canMarkRead),
        data: { url: data.url || "/notifications", id: data.id, readToken: data.readToken },
      }),
      setBadge(data.unread),
    ])
  );
});

const markRead = async ({ id, readToken }) => {
  if (!API || !id || !readToken) return;
  try {
    const res = await fetch(`${API}/push/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, token: readToken }),
    });
    if (!res.ok) return;
    const json = await res.json();
    await setBadge(json?.data?.unread);
  } catch {
    // Offline - it'll be read when they next open it.
  }
};

const openPage = async (path) => {
  // Only ever open pages on this site.
  const target = new URL(path || "/notifications", self.location.origin);
  const url = target.origin === self.location.origin ? target.href : `${self.location.origin}/notifications`;

  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  const open = windows.find((client) => new URL(client.url).origin === self.location.origin);
  if (open) {
    await open.focus();
    if ("navigate" in open) return open.navigate(url);
  }
  return self.clients.openWindow(url);
};

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};

  // "Mark as read": no page opens.
  if (event.action === "read") {
    event.waitUntil(markRead(data));
    return;
  }

  // Tapping the alert, "Reply" or "View order": the page marks it read.
  event.waitUntil(openPage(data.url));
});
