"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateUserStatus } from "../services/admin-user.services";
import { ApiResponse, ApiErrorResponse } from "../types/api";
import { UpdateUserStatusPayload, UpdateUserStatusResponse } from "../types/admin-user";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UpdateUserStatusResponse>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateUserStatusPayload }
  >({
    mutationFn: ({ id, data }) => updateUserStatus(id, data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      const { storeSuspended } = response.data;
      if (storeSuspended === true) {
        toast.success("User suspended — their store is now hidden from the marketplace");
      } else if (storeSuspended === false) {
        toast.success("User reactivated — their store is visible again");
      } else {
        toast.success("User status updated");
      }
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update status");
    },
  });
};
