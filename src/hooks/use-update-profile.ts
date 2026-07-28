"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateProfile } from "../services/profile.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateProfilePayload } from "../types/profile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, UpdateProfilePayload>({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update profile");
    },
  });
};
