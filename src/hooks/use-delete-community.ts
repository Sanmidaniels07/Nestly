"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteCommunity } from "../services/community.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteCommunity,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast.success("Community deleted");
      router.push("/communities");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete community");
    },
  });
};
