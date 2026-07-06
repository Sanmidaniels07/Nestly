"use client";

interface Event {
  title: string;
  day: string;
  month: string;
  attendees: number;
}

const events: Event[] = [
  { title: "Startup Meetup", day: "12", month: "Jul", attendees: 84 },
  { title: "Tech Conference", day: "14", month: "Jul", attendees: 312 },
];

export default function UpcomingEvents() {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h3 className="text-[15px] font-semibold text-[#13131A]">
        Upcoming events
      </h3>

      <div className="mt-4 space-y-2">
        {events.map((event) => (
          <div
            key={event.title}
            className="flex items-center gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-[#F7F7FB]"
          >
            <div className="flex w-12 shrink-0 flex-col items-center rounded-lg border border-[#ECE9F6] bg-[#FBFAFE] py-1.5">
              <span className="font-[family-name:var(--font-mono)] text-[15px] font-semibold leading-none text-violet-600">
                {event.day}
              </span>
              <span className="mt-1 text-[9.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                {event.month}
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                {event.title}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                {event.attendees} going
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}