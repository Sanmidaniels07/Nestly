"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, CalendarDays } from "lucide-react";

import { useEvents } from "@/src/hooks/use-events";
import { EventListParams } from "@/src/types/event";
import CreateEventModal from "./create-event-modal";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const scopes: { label: string; value: EventListParams["scope"] }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "All", value: "all" },
];

export default function EventsPage() {
  const [scope, setScope] = useState<EventListParams["scope"]>("upcoming");
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useEvents({ scope, limit: 30 });
  const events = data?.events ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
            {data?.total ?? 0} events
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[40px] italic leading-none text-[#13131A]">
            Events
          </h1>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Plus size={16} />
          Create event
        </button>
      </div>

      <div className="flex gap-2">
        {scopes.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setScope(tab.value)}
            className={`
              rounded-full px-4 py-2 text-[13px] font-semibold transition-colors
              ${
                scope === tab.value
                  ? "bg-violet-600 text-white"
                  : "border border-[#E5E7EB] text-[#64748B] hover:border-violet-200"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">No events yet</p>
          <p className="mt-1 text-[14px] text-[#64748B]">Be the first to create one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => {
            const startDate = new Date(event.startAt);

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center gap-4 rounded-2xl border border-[#EDEBF5] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.25)]"
              >
                <div className="flex w-14 shrink-0 flex-col items-center rounded-xl border border-[#ECE9F6] bg-[#FBFAFE] py-2">
                  <span className="font-[family-name:var(--font-mono)] text-[18px] font-semibold leading-none text-violet-600">
                    {startDate.getDate()}
                  </span>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    {MONTHS[startDate.getMonth()]}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-[#13131A]">
                    {event.title}
                  </p>
                  {event.location && (
                    <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
                      {event.location}
                    </p>
                  )}
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                    {event.attendeeCount ?? 0} going
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <CreateEventModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
