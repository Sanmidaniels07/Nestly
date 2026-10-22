"use client";

import { use, useState } from "react";
import {
  CalendarDays,
  Check,
  MapPin,
  MessageCircle,
  Pencil,
  Star,
  Trash2,
  Users2,
  X,
} from "lucide-react";

import { useEvent } from "@/src/hooks/use-event";
import { DateTimeField } from "@/src/components/ui/calendar-picker";
import { useEventAttendees } from "@/src/hooks/use-event-attendees";
import { useRsvpEvent } from "@/src/hooks/use-rsvp-event";
import { useUpdateEvent } from "@/src/hooks/use-update-event";
import { useCancelEvent } from "@/src/hooks/use-cancel-event";
import { useEventComments } from "@/src/hooks/use-event-comments";
import { useCreateEventComment } from "@/src/hooks/use-create-event-comment";
import { useDeleteEventComment } from "@/src/hooks/use-delete-event-comment";
import { useAuthStore } from "@/src/store/auth-store";
import { AuthorAvatarLink, AuthorNameLink } from "@/src/components/social/author-link";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { formatRelativeTime } from "@/src/lib/date";

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toDateTimeLocal(dateString: string) {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const authUser = useAuthStore((state) => state.user);

  const { data: event, isLoading } = useEvent(id);
  const { data: attendeesData } = useEventAttendees(id, { limit: 12 });
  const attendees = attendeesData?.attendees ?? [];

  const { status, setGoing, setInterested, cancelRsvp, isUpdating } = useRsvpEvent(
    id,
    event?.myRsvpStatus ?? null
  );

  const { mutate: updateEvent, isPending: isSaving } = useUpdateEvent();
  const { mutate: cancelEvent, isPending: isCancelling } = useCancelEvent();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startAt: "",
    endAt: "",
  });

  const isOrganizer = !!authUser && event?.creatorId === authUser.id;

  const startEditing = () => {
    if (!event) return;
    setForm({
      title: event.title,
      description: event.description ?? "",
      location: event.location ?? "",
      startAt: toDateTimeLocal(event.startAt),
      endAt: event.endAt ? toDateTimeLocal(event.endAt) : "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    updateEvent(
      {
        id,
        data: {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          location: form.location.trim() || undefined,
          startAt: new Date(form.startAt).toISOString(),
          endAt: form.endAt ? new Date(form.endAt).toISOString() : undefined,
        },
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleCancelEvent = () => {
    if (!confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }
    cancelEvent(id);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-20 pt-6">
        <div className="h-64 animate-pulse rounded-2xl bg-surface-2" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl pb-20 pt-16 text-center">
        <p className="text-[15px] font-medium text-ink">Event not found</p>
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

      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <div>
              <label className="mb-2 block text-[13px] font-medium text-ink-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full resize-none rounded-2xl border border-line-strong bg-surface-sunken px-4 py-3 text-[14px] text-ink outline-none focus:border-violet-400 focus:bg-surface"
              />
            </div>
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <DateTimeField
                label="Starts"
                value={form.startAt}
                onChange={(startAt) => setForm((prev) => ({ ...prev, startAt }))}
              />
              <DateTimeField
                label="Ends (optional)"
                value={form.endAt}
                onChange={(endAt) => setForm((prev) => ({ ...prev, endAt }))}
                min={form.startAt ? form.startAt.slice(0, 10) : undefined}
              />
            </div>
            <div className="flex gap-2.5 border-t border-line-soft pt-5">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="h-11 rounded-xl px-6">
                Cancel
              </Button>
              <Button
                variant="tribely"
                onClick={handleSave}
                loading={isSaving}
                disabled={!form.title.trim()}
                className="h-11 rounded-xl px-6"
              >
                Save changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] italic leading-none text-ink">
                {event.title}
              </h1>

              {isOrganizer && (
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={startEditing}
                    aria-label="Edit event"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-subtle transition-colors hover:bg-surface-2 hover:text-violet-600 dark:hover:text-violet-400"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={handleCancelEvent}
                    disabled={isCancelling}
                    aria-label={confirmingCancel ? "Confirm cancel event" : "Cancel event"}
                    className={`
                      flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium transition-colors disabled:opacity-50
                      ${
                        confirmingCancel
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "w-9 text-subtle hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                      }
                    `}
                  >
                    <Trash2 size={15} />
                    {confirmingCancel && "Sure?"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-[13.5px] text-muted">
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
              <p className="mt-5 text-[14.5px] leading-relaxed text-ink-3">
                {event.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-line-soft pt-6">
              <button
                onClick={setGoing}
                disabled={isUpdating}
                className={`
                  flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors disabled:opacity-50
                  ${
                    status === "GOING"
                      ? "bg-violet-600 text-white"
                      : "border border-line-strong text-muted hover:border-violet-200 dark:hover:border-violet-500/30 hover:text-violet-600 dark:hover:text-violet-400"
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
                      : "border border-line-strong text-muted hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="flex items-center gap-1.5 rounded-full border border-line-strong px-5 py-2.5 text-[13.5px] font-semibold text-muted transition-colors hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-500 disabled:opacity-50"
                >
                  <X size={15} />
                  Cancel RSVP
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {attendees.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-[15px] font-semibold text-ink">Attendees</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center gap-2 rounded-full border border-line py-1.5 pl-1.5 pr-4"
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
                <span className="text-[13px] font-medium text-ink">
                  {attendee.user.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <EventCommentsSection eventId={id} />
    </div>
  );
}

function EventCommentsSection({ eventId }: { eventId: string }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [content, setContent] = useState("");

  const { data, isLoading } = useEventComments(eventId, { limit: 50 });
  const { mutate: createComment, isPending: isPosting } = useCreateEventComment(eventId);
  const { mutate: deleteComment } = useDeleteEventComment(eventId);

  const comments = data?.comments ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createComment(content.trim(), { onSuccess: () => setContent("") });
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center gap-2">
        <MessageCircle size={16} className="text-violet-600 dark:text-violet-400" />
        <h2 className="text-[15px] font-semibold text-ink">Discussion</h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ask a question or leave a comment..."
          maxLength={500}
          className="flex-1 rounded-full bg-surface-2 px-4 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-subtle focus:bg-surface-muted"
        />
        <button
          type="submit"
          disabled={!content.trim() || isPosting}
          className="rounded-full bg-violet-600 px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPosting ? "..." : "Send"}
        </button>
      </form>

      {isLoading ? (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="mt-5 text-[13px] text-subtle">
          No comments yet. Be the first to say something.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <AuthorAvatarLink author={comment.user} size={32} />

              <div className="flex-1 rounded-2xl bg-surface-2 px-4 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-ink">
                    <AuthorNameLink author={comment.user} />
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-subtle">
                      {formatRelativeTime(comment.createdAt)}
                    </span>

                    {comment.userId === currentUserId && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        aria-label="Delete comment"
                        className="text-subtle transition-colors hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-0.5 text-[13.5px] text-ink-2">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
