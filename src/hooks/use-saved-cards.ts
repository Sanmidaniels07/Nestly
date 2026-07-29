"use client";

import { useQuery } from "@tanstack/react-query";

import { getSavedCards } from "../services/payment-method.services";

export const useSavedCards = () => {
  return useQuery({
    queryKey: ["saved-cards"],
    queryFn: getSavedCards,
    select: (response) => response.data,
  });
};
