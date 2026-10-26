import { Fragment } from "react";
import { Lock } from "lucide-react";

// Must match the backend's CONTACT_MASK (utils/contactFilter).
export const CONTACT_MASK = "••••••";

// Message text with hidden contact details (phone numbers, emails, handles,
// social links - removed by the server in chats with a seller) shown as a
// blurred chip, so it's clear something was hidden and why.
export default function MessageText({ text }: { text: string }) {
  if (!text.includes(CONTACT_MASK)) return <>{text}</>;

  const parts = text.split(CONTACT_MASK);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              title="Contact details are hidden - keep chats and payments on Nestly"
              aria-label="Contact details hidden"
              className="mx-0.5 inline-flex select-none items-center gap-1 rounded-md bg-black/10 px-1.5 align-baseline dark:bg-white/15"
            >
              <Lock size={11} className="shrink-0 opacity-80" />
              <span aria-hidden className="blur-[3px]">0803 555 0199</span>
            </span>
          )}
        </Fragment>
      ))}
    </>
  );
}
