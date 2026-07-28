"use client";

import { useQuery } from "@tanstack/react-query";

import { getEvents } from "../services/event.services";
import { EventListParams } from "../types/event";

export const useEvents = (params: EventListParams = {}) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => getEvents(params),
    select: (response) => response.data,
  });
};
