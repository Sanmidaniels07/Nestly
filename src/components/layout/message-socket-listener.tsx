"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getSocket } from "@/src/lib/socket";
import { useAuthStore } from "@/src/store/auth-store";
import { Message } from "@/src/types/conversation";

export default function MessageSocketListener() {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();
    // The server derives the room from the verified access token during the
    // handshake now, so there's nothing left to tell it client-side.
    socket.connect();

    const handleNewMessage = (message: Message) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", message.conversationId],
      });

      if (message.senderId !== userId) {
        toast(`New message from ${message.sender?.name ?? "someone"}`, {
          icon: "\u{1F4AC}",
        });
      }
    };

    const handleMessageRead = ({ conversationId }: { conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleMessageRead);
      socket.disconnect();
    };
  }, [userId, queryClient]);

  return null;
}
