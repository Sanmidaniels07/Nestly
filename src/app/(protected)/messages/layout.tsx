"use client";

import { usePathname } from "next/navigation";

import ConversationList from "@/src/components/messages/conversation-list";

// Chats: on desktop the list sits beside the open chat; on phones you see
// one or the other.
export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inThread = pathname !== "/messages";

  return (
    <div className="mx-auto flex h-[calc(100dvh-11rem)] max-w-6xl overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_24px_60px_-32px_rgba(91,33,182,0.35)] lg:h-[calc(100dvh-7.5rem)]">
      <aside className={`${inThread ? "hidden lg:flex" : "flex"} w-full flex-col border-line lg:w-[360px] lg:shrink-0 lg:border-r`}>
        <ConversationList />
      </aside>
      <section className={`${inThread ? "flex" : "hidden lg:flex"} min-w-0 flex-1 flex-col`}>{children}</section>
    </div>
  );
}
