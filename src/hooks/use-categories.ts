"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../services/category.services";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (response) => response.data,
  });
};
