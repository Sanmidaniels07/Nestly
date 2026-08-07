import { io, Socket } from "socket.io-client";

import { useAuthStore } from "../store/auth-store";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "");
    socket = io(socketUrl, {
      autoConnect: false,
      // A function (not a plain object) so it's re-read on every connection
      // attempt, including automatic reconnects - the server verifies this
      // the same way it verifies a Bearer header and derives the socket's
      // room from it, so a stale token here just fails the handshake rather
      // than silently joining the wrong room.
      auth: (callback) => callback({ token: useAuthStore.getState().accessToken }),
    });
  }

  return socket;
};
