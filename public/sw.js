// Nestly service worker: shows push notifications (messages, orders, likes
// and every other alert) - even while Nestly is open - and opens the right page
// when one is tapped. Pushes come from the API (utils/webPush) as
// { title, body, url, tag }. No caching or offline behaviour.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Nestly", {
      body: data.body || "",
      icon: "/icon.png",
      // Same tag replaces the earlier alert (e.g. one per chat) and still
      // buzzes the phone.
      tag: data.tag,
      renotify: !!data.tag,
      data: { url: data.url || "/notifications" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Only ever open pages on this site.
  const target = new URL(event.notification.data?.url || "/notifications", self.location.origin);
  const url = target.origin === self.location.origin ? target.href : `${self.location.origin}/notifications`;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const open = windows.find((client) => new URL(client.url).origin === self.location.origin);
      if (open) {
        await open.focus();
        if ("navigate" in open) return open.navigate(url);
      }
      return self.clients.openWindow(url);
    })()
  );
});
