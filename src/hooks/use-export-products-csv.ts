"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { exportMyProductsCsv } from "../services/product.services";
import { ApiErrorResponse } from "../types/api";

export const useExportProductsCsv = () => {
  return useMutation<Blob, AxiosError<ApiErrorResponse>, void>({
    mutationFn: exportMyProductsCsv,

    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to export products");
    },
  });
};
