"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyStore } from "../services/store.services";

export const useMyStore = (enabled = true) => {
  return useQuery({
    queryKey: ["store", "me"],
    queryFn: getMyStore,
    select: (response) => response.data,
    enabled,
    retry: false,
  });
};
