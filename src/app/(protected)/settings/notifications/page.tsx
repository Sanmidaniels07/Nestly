"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useNotificationPreferences } from "@/src/hooks/use-notification-preferences";
import { useUpdateNotificationPreference } from "@/src/hooks/use-update-notification-preference";
import { NotificationPreferenceType } from "@/src/types/notification";
import CheckboxRow from "@/src/components/ui/checkbox-row";

const PREFERENCE_META: Record<
  NotificationPreferenceType,
  { label: string; description: string }
> = {
  LIKE: {
    label: "Likes & reactions",
    description: "When someone reacts to your posts or comments.",
  },
  COMMENT: {
    label: "Comments & replies",
    description: "When someone comments on your post or replies to you.",
  },
  FOLLOW: {
    label: "New followers",
    description: "When someone starts following you.",
  },
  MESSAGE: {
    label: "Direct messages",
    description: "When you receive a new message.",
  },
  ORDER: {
    label: "Marketplace orders",
    description: "Order status updates, shipping, and returns.",
  },
  SYSTEM: {
    label: "System announcements",
    description: "Important updates about your account and Nestly.",
  },
};

export default function SettingsNotificationsPage() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const { mutate: updatePreference, isPending } = useUpdateNotificationPreference();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
          Notifications
        </h2>
        <p className="mt-1 text-[13.5px] text-[#64748B]">
          Control what you get notified about.
        </p>
      </div>

      <Link
        href="/notifications"
        className="group flex items-center justify-between rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-colors hover:border-violet-200 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
      >
        <div>
          <h3 className="text-[14.5px] font-semibold text-[#13131A]">View all notifications</h3>
          <p className="mt-0.5 text-[12.5px] text-[#64748B]">See what you&apos;ve missed.</p>
        </div>
        <ArrowRight size={17} className="text-[#C4C0DC] transition-all group-hover:translate-x-0.5 group-hover:text-violet-600" />
      </Link>

      <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
        <div>
          <h3 className="text-[15px] font-semibold text-[#13131A]">Notify me about</h3>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Choose which activity sends you a notification.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {isLoading ? (
            <>
              <div className="h-16 animate-pulse rounded-2xl bg-[#F7F7FB]" />
              <div className="h-16 animate-pulse rounded-2xl bg-[#F7F7FB]" />
              <div className="h-16 animate-pulse rounded-2xl bg-[#F7F7FB]" />
            </>
          ) : (
            preferences?.map((pref) => (
              <CheckboxRow
                key={pref.type}
                label={PREFERENCE_META[pref.type].label}
                description={PREFERENCE_META[pref.type].description}
                checked={pref.enabled}
                disabled={isPending}
                onChange={(enabled) => updatePreference({ type: pref.type, enabled })}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
