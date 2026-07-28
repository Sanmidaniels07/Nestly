"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { joinCommunity, leaveCommunity } from "../services/community.services";
import { ApiErrorResponse } from "../types/api";

export const useToggleCommunityMembership = (
  slug: string,
  initialIsMember: boolean
) => {
  const queryClient = useQueryClient();
  const [isMember, setIsMember] = useState(initialIsMember);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["community", slug] });
    queryClient.invalidateQueries({ queryKey: ["communities"] });
  };

  const join = useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => joinCommunity(slug),
    onSuccess: () => {
      setIsMember(true);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to join community");
    },
  });

  const leave = useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => leaveCommunity(slug),
    onSuccess: () => {
      setIsMember(false);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to leave community");
    },
  });

  return {
    isMember,
    toggleMembership: () => (isMember ? leave.mutate() : join.mutate()),
    isToggling: join.isPending || leave.isPending,
  };
};
