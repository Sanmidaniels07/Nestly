"use client";

import Link from "next/link";
import { useEvents } from "@/src/hooks/use-events";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function UpcomingEvents() {
  const { data, isLoading } = useEvents({ scope: "upcoming", limit: 2 });
  const events = data?.events ?? [];

  if (!isLoading && !events.length) return null;

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h3 className="text-[15px] font-semibold text-[#13131A]">
        Upcoming events
      </h3>

      <div className="mt-4 space-y-2">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-[#F7F7FB]" />
            ))
          : events.map((event) => {
              const startDate = new Date(event.startAt);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-[#F7F7FB]"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-lg border border-[#ECE9F6] bg-[#FBFAFE] py-1.5">
                    <span className="font-[family-name:var(--font-mono)] text-[15px] font-semibold leading-none text-violet-600">
                      {startDate.getDate()}
                    </span>
                    <span className="mt-1 text-[9.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                      {MONTHS[startDate.getMonth()]}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                      {event.title}
                    </p>
                    <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                      {event.attendeeCount ?? 0} going
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
