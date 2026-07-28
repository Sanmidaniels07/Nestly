"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createCommunity } from "../services/community.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { Community, CreateCommunityPayload } from "../types/community";

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Community>,
    AxiosError<ApiErrorResponse>,
    CreateCommunityPayload
  >({
    mutationFn: createCommunity,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast.success("Community created");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to create community");
    },
  });
};
