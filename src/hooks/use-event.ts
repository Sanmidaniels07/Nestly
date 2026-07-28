"use client";

import { useQuery } from "@tanstack/react-query";

import { getEvent } from "../services/event.services";

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
