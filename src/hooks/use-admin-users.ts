"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminUsers } from "../services/admin-user.services";
import { AdminUserListParams } from "../types/admin-user";

export const useAdminUsers = (params: AdminUserListParams) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
    select: (response) => response.data,
  });
};
