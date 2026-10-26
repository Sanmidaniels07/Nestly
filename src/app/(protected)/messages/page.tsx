import { MessageCircle } from "lucide-react";

// Desktop: shown beside the chat list until a chat is opened (phones see
// just the list - see layout.tsx).
export default function MessagesPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.06),transparent_60%)] px-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_12px_30px_-12px_rgba(91,33,182,0.7)]">
        <MessageCircle size={28} />
      </span>
      <p className="mt-5 font-[family-name:var(--font-fraunces)] text-[24px] italic text-ink">Your chats</p>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-muted">
        Pick a chat to start messaging. Ask sellers about products, share photos, and keep every payment on Nestly checkout.
      </p>
    </div>
  );
}
