import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreateEventPayload,
  EventAttendee,
  EventComment,
  EventListParams,
  NestlyEvent,
  RsvpStatus,
  UpdateEventPayload,
} from "../types/event";

export const createEvent = async (data: CreateEventPayload) => {
  const response = await api.post<ApiResponse<NestlyEvent>>("/events", data);
  return response.data;
};

export const getEvents = async (params: EventListParams) => {
  const response = await api.get<ApiResponse<Paginated<"events", NestlyEvent>>>(
    "/events",
    { params }
  );
  return response.data;
};

export const getEvent = async (id: string) => {
  const response = await api.get<ApiResponse<NestlyEvent>>(`/events/${id}`);
  return response.data;
};

export const getEventAttendees = async (
  id: string,
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<
    ApiResponse<Paginated<"attendees", EventAttendee>>
  >(`/events/${id}/attendees`, { params });
  return response.data;
};

export const rsvpEvent = async (id: string, status: RsvpStatus) => {
  const response = await api.post<ApiResponse<EventAttendee>>(
    `/events/${id}/rsvp`,
    { status }
  );
  return response.data;
};

export const cancelRsvp = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/events/${id}/rsvp`);
  return response.data;
};

export const updateEvent = async (id: string, data: UpdateEventPayload) => {
  const response = await api.patch<ApiResponse<NestlyEvent>>(
    `/events/${id}`,
    data
  );
  return response.data;
};

export const cancelEvent = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/events/${id}`);
  return response.data;
};

export const createEventComment = async (id: string, content: string) => {
  const response = await api.post<ApiResponse<EventComment>>(
    `/events/${id}/comments`,
    { content }
  );
  return response.data;
};

export const getEventComments = async (
  id: string,
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<
    ApiResponse<Paginated<"comments", EventComment>>
  >(`/events/${id}/comments`, { params });
  return response.data;
};

export const deleteEventComment = async (commentId: string) => {
  const response = await api.delete<ApiResponse<null>>(
    `/events/comments/${commentId}`
  );
  return response.data;
};
