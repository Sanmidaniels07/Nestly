"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  Cake,
  Gift,
  CheckCheck,
  Heart,
  MailIcon,
  MessageCircle,
  Radio,
  ShoppingBag,
  Store,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { useNotifications } from "@/src/hooks/use-notifications";
import { useMarkNotificationRead } from "@/src/hooks/use-mark-notification-read";
import { useMarkAllNotificationsRead } from "@/src/hooks/use-mark-all-notifications-read";
import { formatRelativeTime } from "@/src/lib/date";
import { Notification } from "@/src/types/notification";
import { targetHref } from "@/src/lib/notification-link";

const ICON_MAP = {
  like: Heart,
  reaction: Heart,
  comment: MessageCircle,
  reply: MessageCircle,
  follow: UserPlus,
  message: MailIcon,
  order: ShoppingBag,
  marketplace: ShoppingBag,
  shopping: ShoppingBag,
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
          <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {unread.length > 0 ? `${unread.length} unread` : "All caught up"}
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[28px] leading-none text-ink">
            Notifications
          </h1>
        </div>

        {unread.length > 0 && (
          <button
            onClick={() => markAllRead()}
            disabled={markingAll}
            className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50/60 px-3.5 py-2.5 text-[13px] font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200 dark:hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={15} />
            {markingAll ? "Marking all read..." : "Mark all as read"}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <Bell className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] font-medium text-ink">No notifications yet</p>
          <p className="mt-1 text-[12.5px] text-subtle">
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

// Each kind of notification gets its own colour, so the list is easy to
// scan: pink for birthdays and likes, amber for gifts, green for orders and
// money, blue for conversations, red for live, violet for everything else.
// Dark mode uses a tinted tile with a bright icon, so it never washes out.
const TONES = {
  violet: "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-400/15 dark:text-violet-300 dark:ring-violet-400/25",
  rose: "bg-rose-100 text-rose-600 ring-rose-200 dark:bg-rose-400/15 dark:text-rose-300 dark:ring-rose-400/25",
  amber: "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/25",
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/25",
  sky: "bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-400/15 dark:text-sky-300 dark:ring-sky-400/25",
  red: "bg-red-100 text-red-600 ring-red-200 dark:bg-red-400/15 dark:text-red-300 dark:ring-red-400/25",
} as const;

type Tone = keyof typeof TONES;

const KEY_TONE: Record<keyof typeof ICON_MAP, Tone> = {
  like: "rose",
  reaction: "rose",
  comment: "sky",
  reply: "sky",
  follow: "violet",
  message: "sky",
  order: "emerald",
  marketplace: "emerald",
  shopping: "emerald",
  community: "violet",
};

function iconFor(notification: Notification): { Icon: typeof Bell; tone: Tone } {
  const target = notification.targetType ?? "";
  // Birthday reminders and gifts are SYSTEM-type, so pick them by target.
  if (target === "BIRTHDAY" || target === "BIRTHDAY_SOON") return { Icon: Cake, tone: "rose" };
  if (target === "GIFT") return { Icon: Gift, tone: "amber" };
  if (target.startsWith("LIVE") || (notification.type ?? "").toUpperCase() === "LIVE") return { Icon: Radio, tone: "red" };
  if (target === "SELLER_EARNINGS" || target === "ADMIN_PAYOUT_FAILED" || target === "ADMIN_PAYOUT_ACCOUNT_CHANGED") return { Icon: Wallet, tone: "emerald" };
  if (target === "CONVERSATION") return { Icon: MailIcon, tone: "sky" };
  if (target.startsWith("SELLER_") || target === "CAC_REMINDER" || target === "STORE_PAGE" || target === "ADMIN_CAC_SUBMITTED") return { Icon: Store, tone: "violet" };
  const key = iconKeyFor(notification.type);
  return key ? { Icon: ICON_MAP[key], tone: KEY_TONE[key] } : { Icon: Bell, tone: "violet" };
}

function NotificationRow({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen: () => void;
}) {
  const { Icon, tone } = iconFor(notification);
  const unread = !notification.isRead;

  return (
    <button
      onClick={onOpen}
      className={`
        group relative flex w-full items-start gap-3.5 overflow-hidden rounded-2xl border p-4 text-left transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60
        ${
          unread
            ? "border-violet-200 bg-violet-50/70 hover:border-violet-300 hover:bg-violet-50 dark:border-violet-400/25 dark:bg-violet-400/[0.07] dark:hover:border-violet-400/40 dark:hover:bg-violet-400/[0.11]"
            : "border-line bg-surface hover:border-violet-200 hover:bg-surface-2/60 dark:hover:border-violet-400/20"
        }
      `}
    >
      {unread && (
        <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-violet-500 to-indigo-500" />
      )}

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${TONES[tone]} ${
          unread ? "" : "opacity-70 group-hover:opacity-100"
        } transition-opacity`}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[13.5px] leading-snug ${
            unread ? "font-medium text-ink" : "text-muted"
          }`}
        >
          {notification.message}
        </p>
        <p className={`mt-1 text-[12px] ${unread ? "text-violet-700/80 dark:text-violet-300/80" : "text-subtle"}`}>
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {unread && (
        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-violet-600 ring-4 ring-violet-600/15 dark:bg-violet-400 dark:ring-violet-400/20" aria-label="Unread" />
      )}
    </button>
  );
}
