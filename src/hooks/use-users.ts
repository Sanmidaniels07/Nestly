"use client";

import { useQuery } from "@tanstack/react-query";

import { getUsers } from "../services/user.services";
import { UserListParams } from "../types/user";

export const useUsers = (params: UserListParams = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    select: (response) => response.data,
  });
};
