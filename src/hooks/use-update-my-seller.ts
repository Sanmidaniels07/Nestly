"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateMySeller } from "../services/seller.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { BecomeSellerPayload, CacCheckResult, SellerProfile } from "../types/seller";

// What the seller is told once their number has been looked up.
const SAVED_MESSAGE: Partial<Record<CacCheckResult, string>> = {
  VERIFIED: "Business verified ✓ - your store now shows the badge",
  AWAITING_STORE: "CAC number found - create your store with your registered name to get verified",
  NAME_MISMATCH: "CAC number saved - our team will check it against your store name",
  INACTIVE: "CAC number saved - the register shows it isn't active, our team will take a look",
  NOT_FOUND: "We couldn't find that number on the CAC register - check the number and business type",
};

// Add, change or remove the seller's CAC number.
export const useUpdateMySeller = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<SellerProfile>, AxiosError<ApiErrorResponse>, BecomeSellerPayload>({
    mutationFn: updateMySeller,

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seller", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      if (!variables.cacNumber) {
        toast.success("CAC number removed");
        return;
      }
      const result = response.data?.cacCheckResult;
      const message = (result && SAVED_MESSAGE[result]) ?? "CAC number saved - we'll check it shortly";
      if (result === "NOT_FOUND") toast.error(message, { duration: 6000 });
      else toast.success(message, { duration: result === "VERIFIED" ? 4000 : 6000 });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Couldn't save your CAC number");
    },
  });
};
