"use client";

import Link from "next/link";
import { Cake, CalendarDays, MapPin, Users2 } from "lucide-react";

import UserAvatar from "@/src/components/ui/user-avatar";
import { UserDashboard } from "@/src/types/user-dashboard";
import { birthdayLabel, plural, shortDate } from "./format";

interface Props {
  birthdays: UserDashboard["upcomingBirthdays"];
  community: UserDashboard["community"];
}

export default function UpcomingCard({ birthdays, community }: Props) {
  const events = community.upcomingEvents;
  const isEmpty = birthdays.length === 0 && events.length === 0;

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">Coming up</h2>
        <Link
          href="/communities"
          className="flex items-center gap-1 text-[12.5px] text-muted hover:text-violet-600 dark:hover:text-violet-400"
        >
          <Users2 size={13} />
          {plural(community.communitiesJoined, "community")}
        </Link>
      </div>

      {isEmpty && (
        <div className="mt-4 rounded-xl bg-surface-sunken px-4 py-6 text-center">
          <p className="text-[13px] text-muted">No birthdays or events in the next 30 days.</p>
          <Link href="/events" className="mt-2 inline-block text-[12.5px] font-semibold text-violet-600 hover:underline dark:text-violet-400">
            Browse events
          </Link>
        </div>
      )}

      {birthdays.length > 0 && (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
            <Cake size={13} /> Birthdays
          </p>
          <ul className="mt-2 space-y-1">
            {birthdays.map((person) => (
              <li key={person.id}>
                <Link
                  href={`/users/${person.username ?? person.id}`}
                  className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2"
                >
                  <UserAvatar name={person.name} src={person.avatar} size={32} />
                  <p className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">{person.name}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                      person.daysAway === 0
                        ? "bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400"
                        : "bg-surface-2 text-muted"
                    }`}
                  >
                    {person.daysAway <= 7 ? birthdayLabel(person.daysAway) : shortDate(person.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {events.length > 0 && (
        <div className={birthdays.length > 0 ? "mt-5 border-t border-line-soft pt-4" : "mt-4"}>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
            <CalendarDays size={13} /> Your events
          </p>
          <ul className="mt-2 space-y-1">
            {events.map((event) => {
              const start = new Date(event.startAt);
              return (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2"
                  >
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                      <span className="text-[10px] font-semibold uppercase leading-none">
                        {start.toLocaleDateString("en-NG", { month: "short" })}
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-[16px] font-semibold leading-tight">
                        {start.getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-ink">{event.title}</p>
                      <p className="flex items-center gap-1 truncate text-[12px] text-subtle">
                        {start.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" })}
                        {event.location && (
                          <>
                            <span>·</span>
                            <MapPin size={11} className="shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
