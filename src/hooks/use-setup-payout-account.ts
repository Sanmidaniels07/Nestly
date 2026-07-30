"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { setupPayoutAccount } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";
import { SetupPayoutAccountPayload } from "../types/store";

export const useSetupPayoutAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { slug: string; data: SetupPayoutAccountPayload }
  >({
    mutationFn: ({ slug, data }) => setupPayoutAccount(slug, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", "me"] });
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Automatic payouts are now active for this store");
    },

    onError: (error) => {
      toast.error(
        error.response?.data.message ?? "Couldn't verify those account details"
      );
    },
  });
};
