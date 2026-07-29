"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import CheckboxRow from "@/src/components/ui/checkbox-row";

const PREFERENCES = [
  { label: "Likes & reactions", description: "When someone reacts to your posts or comments." },
  { label: "Comments & replies", description: "When someone comments on your post or replies to you." },
  { label: "New followers", description: "When someone starts following you." },
  { label: "Direct messages", description: "When you receive a new message." },
  { label: "Marketplace orders", description: "Order status updates, shipping, and returns." },
  { label: "Community activity", description: "Posts and announcements in communities you've joined." },
];

export default function SettingsNotificationsPage() {
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-semibold text-[#13131A]">Notify me about</h3>
            <p className="mt-1 text-[13px] text-[#64748B]">
              Choose which activity sends you a notification.
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#F1F0F5] px-2.5 py-1 text-[11px] font-medium text-[#64748B]">
            <Clock size={11} />
            Coming soon
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {PREFERENCES.map((pref) => (
            <CheckboxRow
              key={pref.label}
              label={pref.label}
              description={pref.description}
              checked
              disabled
              onChange={() => {}}
            />
          ))}
        </div>

        <p className="mt-4 text-[12px] text-[#94A3B8]">
          Preference controls aren&apos;t saved to the server yet — everything is currently
          on by default. This will become editable once notification preferences are
          supported on the backend.
        </p>
      </section>
    </div>
  );
}
