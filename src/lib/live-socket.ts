import { io, Socket } from "socket.io-client";

import { useAuthStore } from "../store/auth-store";

// The API's /live namespace (chat, hearts, pins, viewer counts). Unlike the
// main socket, a login is optional here, so guests on a shared live link
// still see the chat and the pinned product.

let socket: Socket | null = null;

export const getLiveSocket = () => {
  if (!socket) {
    const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "");
    socket = io(`${base}/live`, {
      autoConnect: false,
      // Re-read on every (re)connect, so logging in mid-live upgrades a guest.
      auth: (callback) => callback({ token: useAuthStore.getState().accessToken ?? undefined }),
    });
  }
  return socket;
};

/** After logging in on the live page, reconnect so the server knows who's chatting. */
export const reconnectLiveSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket.connect();
};
