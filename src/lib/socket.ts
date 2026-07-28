import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "");
    socket = io(socketUrl, { autoConnect: false });
  }

  return socket;
};
