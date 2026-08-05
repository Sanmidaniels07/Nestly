"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Heart,
  MailIcon,
  MessageCircle,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";

import { useNotifications } from "@/src/hooks/use-notifications";
import { useMarkNotificationRead } from "@/src/hooks/use-mark-notification-read";
import { useMarkAllNotificationsRead } from "@/src/hooks/use-mark-all-notifications-read";
import { formatRelativeTime } from "@/src/lib/date";
import { Notification } from "@/src/types/notification";

function targetHref(notification: Notification): string | null {
  switch (notification.targetType) {
    case "POST":
      return notification.targetId ? `/post/${notification.targetId}` : null;
    case "USER":
      return notification.targetId ? `/users/${notification.targetId}` : null;
    case "CONVERSATION":
      return notification.targetId ? `/messages/${notification.targetId}` : null;
    case "PRODUCT":
      return notification.targetId
        ? `/settings/marketplace/components/products/${notification.targetId}/edit`
        : null;
    case "SELLER_APPLICATION":
      return "/marketplace/sell";
    case "ADMIN_SELLER_APPLICATION":
      return "/admin?tab=sellers";
    case "ADMIN_PAYOUT_ACCOUNT_CHANGED":
      return "/admin?tab=payouts";
    default:
      return null;
  }
}

const ICON_MAP = {
  like: Heart,
  reaction: Heart,
  comment: MessageCircle,
  reply: MessageCircle,
  follow: UserPlus,
  message: MailIcon,
  order: ShoppingBag,
  marketplace: ShoppingBag,
  community: Users,
} as const;

function iconKeyFor(type?: string): keyof typeof ICON_MAP | undefined {
  const value = (type ?? "").toLowerCase();
  return (Object.keys(ICON_MAP) as (keyof typeof ICON_MAP)[]).find((key) =>
    value.includes(key)
  );
}

interface Props {
  onNavigate?: () => void;
}

export default function NotificationsContent({ onNavigate }: Props) {
  const router = useRouter();
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllNotificationsRead();

  const items = notifications ?? [];
  const unread = items.filter((n) => !n.isRead);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
            {unread.length > 0 ? `${unread.length} unread` : "All caught up"}
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[28px] italic leading-none text-[#13131A]">
            Notifications
          </h1>
        </div>

        {unread.length > 0 && (
          <button
            onClick={() => markAllRead()}
            disabled={markingAll}
            className="flex items-center gap-1.5 rounded-xl border border-violet-200 px-3.5 py-2.5 text-[13px] font-medium text-violet-700 transition-colors hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={15} />
            {markingAll ? "Marking all read..." : "Mark all as read"}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <Bell className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] font-medium text-[#13131A]">No notifications yet</p>
          <p className="mt-1 text-[12.5px] text-[#94A3B8]">
            Activity on your account will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onOpen={() => {
                if (!notification.isRead) markRead(notification.id);
                const href = targetHref(notification);
                if (href) {
                  onNavigate?.();
                  router.push(href);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen: () => void;
}) {
  const iconKey = iconKeyFor(notification.type);
  const Icon = iconKey ? ICON_MAP[iconKey] : Bell;

  return (
    <button
      onClick={onOpen}
      className={`
        relative flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-colors
        ${
          notification.isRead
            ? "border-[#ECE9F6] bg-white hover:border-violet-100"
            : "border-violet-200 bg-violet-50/60 hover:border-violet-300"
        }
      `}
    >
      {!notification.isRead && (
        <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
      )}

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          notification.isRead ? "bg-[#F7F7FB] text-[#94A3B8]" : "bg-violet-100 text-violet-600"
        }`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[13.5px] leading-snug ${
            notification.isRead ? "text-[#64748B]" : "font-medium text-[#13131A]"
          }`}
        >
          {notification.message}
        </p>
        <p className="mt-1 text-[12px] text-[#94A3B8]">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {!notification.isRead && (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-600" />
      )}
    </button>
  );
}
