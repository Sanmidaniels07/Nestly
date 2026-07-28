"use client";

import { useQuery } from "@tanstack/react-query";

import { getAddresses } from "../services/address.services";

export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    select: (response) => response.data,
  });
};
