"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createStockAlert, deleteStockAlert, getMyStockAlerts, StockAlertInput } from "../services/stock-alert.services";

// "Notify me when it's back" on sold-out products and options.
export const useMyStockAlerts = (productId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["stock-alerts", productId],
    queryFn: () => getMyStockAlerts(productId),
    select: (response) => response.data.variationIds,
    enabled,
  });
};

export const useToggleStockAlert = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ watching, input }: { watching: boolean; input: StockAlertInput }) =>
      watching ? deleteStockAlert(input) : createStockAlert(input),
    onSuccess: (_response, { watching }) => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts", productId] });
      toast.success(watching ? "Okay, we won't remind you" : "We'll let you know as soon as it's back");
    },
    onError: () => {
      toast.error("Couldn't update that - please try again");
    },
  });
};
