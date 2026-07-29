"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateUserRole } from "../services/admin-user.services";
import { ApiErrorResponse } from "../types/api";
import { UserRole } from "../types/admin-user";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; role: UserRole }
  >({
    mutationFn: ({ id, role }) => updateUserRole(id, role),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update role");
    },
  });
};
