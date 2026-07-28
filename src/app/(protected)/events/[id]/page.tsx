"use client";

import { use } from "react";
import { CalendarDays, Check, MapPin, Star, Users2, X } from "lucide-react";

import { useEvent } from "@/src/hooks/use-event";
import { useEventAttendees } from "@/src/hooks/use-event-attendees";
import { useRsvpEvent } from "@/src/hooks/use-rsvp-event";

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: event, isLoading } = useEvent(id);
  const { data: attendeesData } = useEventAttendees(id, { limit: 12 });
  const attendees = attendeesData?.attendees ?? [];

  const { status, setGoing, setInterested, cancelRsvp, isUpdating } = useRsvpEvent(
    id,
    event?.myRsvpStatus ?? null
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-20 pt-6">
        <div className="h-64 animate-pulse rounded-2xl bg-[#F7F7FB]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl pb-20 pt-16 text-center">
        <p className="text-[15px] font-medium text-[#13131A]">Event not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 pt-6">
      {event.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.coverImage}
          alt={event.title}
          className="h-56 w-full rounded-2xl object-cover sm:h-72"
        />
      )}

      <div className="rounded-2xl border border-[#EDEBF5] bg-white p-6 sm:p-8">
        <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] italic leading-none text-[#13131A]">
          {event.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-5 text-[13.5px] text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={16} />
            <span className="font-[family-name:var(--font-mono)]">
              {formatDateTime(event.startAt)}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              {event.location}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Users2 size={16} />
            {event.attendeeCount ?? 0} going
          </div>
        </div>

        {event.description && (
          <p className="mt-5 text-[14.5px] leading-relaxed text-[#475569]">
            {event.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3 border-t border-[#F2F1F8] pt-6">
          <button
            onClick={setGoing}
            disabled={isUpdating}
            className={`
              flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors disabled:opacity-50
              ${
                status === "GOING"
                  ? "bg-violet-600 text-white"
                  : "border border-[#E5E7EB] text-[#64748B] hover:border-violet-200 hover:text-violet-600"
              }
            `}
          >
            <Check size={15} />
            Going
          </button>

          <button
            onClick={setInterested}
            disabled={isUpdating}
            className={`
              flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors disabled:opacity-50
              ${
                status === "INTERESTED"
                  ? "bg-indigo-600 text-white"
                  : "border border-[#E5E7EB] text-[#64748B] hover:border-indigo-200 hover:text-indigo-600"
              }
            `}
          >
            <Star size={15} />
            Interested
          </button>

          {status && (
            <button
              onClick={cancelRsvp}
              disabled={isUpdating}
              className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] px-5 py-2.5 text-[13.5px] font-semibold text-[#64748B] transition-colors hover:border-red-200 hover:text-red-500 disabled:opacity-50"
            >
              <X size={15} />
              Cancel RSVP
            </button>
          )}
        </div>
      </div>

      {attendees.length > 0 && (
        <div className="rounded-2xl border border-[#EDEBF5] bg-white p-6">
          <h2 className="text-[15px] font-semibold text-[#13131A]">Attendees</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center gap-2 rounded-full border border-[#ECE9F6] py-1.5 pl-1.5 pr-4"
              >
                {attendee.user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={attendee.user.avatar}
                    alt={attendee.user.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-[11px] font-semibold text-white">
                    {attendee.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[13px] font-medium text-[#13131A]">
                  {attendee.user.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
