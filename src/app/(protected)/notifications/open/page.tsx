"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useMarkNotificationRead } from "@/src/hooks/use-mark-notification-read";
import { targetHref } from "@/src/lib/notification-link";
import { NotificationTargetType } from "@/src/types/notification";

// Where a tapped push notification lands (public/sw.js): marks it read and
// goes straight to what it's about - the chat, the order, the post...
function OpenNotification() {
  const router = useRouter();
  const params = useSearchParams();
  const { mutate: markRead } = useMarkNotificationRead();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const id = params.get("id");
    if (id) markRead(id);

    const href = targetHref({
      targetType: (params.get("type") as NotificationTargetType | null) ?? null,
      targetId: params.get("target"),
    });
    router.replace(href ?? "/notifications");
  }, [params, markRead, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export default function OpenNotificationPage() {
  return (
    <Suspense fallback={null}>
      <OpenNotification />
    </Suspense>
  );
}
