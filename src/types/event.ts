import { PublicUser } from "./user";

export type RsvpStatus = "GOING" | "INTERESTED";

export interface NestlyEvent {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  location?: string | null;
  startAt: string;
  endAt?: string | null;
  creatorId: string;
  createdAt: string;
  creator?: PublicUser;
  attendeeCount?: number;
  myRsvpStatus?: RsvpStatus | null;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  coverImage?: string;
  location?: string;
  startAt: string;
  endAt?: string;
}

export interface EventListParams {
  page?: number;
  limit?: number;
  scope?: "upcoming" | "past" | "all";
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  status: RsvpStatus;
  createdAt: string;
  user: PublicUser;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  coverImage?: string;
  location?: string;
  startAt?: string;
  endAt?: string;
}

export interface EventComment {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: PublicUser;
}
