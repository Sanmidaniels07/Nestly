"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getSocket } from "@/src/lib/socket";
import { useAuthStore } from "@/src/store/auth-store";
import { Message } from "@/src/types/conversation";
import { replaceCachedMessage, updateCachedPresence } from "@/src/lib/chat-cache";

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

      // No pop-up for the chat that's already open.
      const viewing = window.location.pathname === `/messages/${message.conversationId}`;
      if (message.senderId !== userId && !viewing) {
        toast(`New message from ${message.sender?.name ?? "someone"}`, {
          icon: "\u{1F4AC}",
        });
      }
    };

    const handleMessageRead = ({ conversationId }: { conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    };

    // A reaction changed or a message was unsent - swap in the new copy.
    const handleMessageUpdated = (message: Message) => {
      replaceCachedMessage(queryClient, message);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handlePresence = (presence: { userId: string; online: boolean; lastSeenAt: string | null }) => {
      updateCachedPresence(queryClient, presence);
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleMessageRead);
    socket.on("message:updated", handleMessageUpdated);
    socket.on("presence", handlePresence);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleMessageRead);
      socket.off("message:updated", handleMessageUpdated);
      socket.off("presence", handlePresence);
      socket.disconnect();
    };
  }, [userId, queryClient]);

  return null;
}
