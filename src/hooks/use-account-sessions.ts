"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccountSessions } from "../services/account.services";

export const useAccountSessions = () => {
  return useQuery({
    queryKey: ["account", "sessions"],
    queryFn: getAccountSessions,
    select: (response) => response.data,
  });
};
