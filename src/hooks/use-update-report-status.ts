"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateReportStatus } from "../services/report.services";
import { ApiErrorResponse } from "../types/api";
import { ReportStatus } from "../types/report";

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; status: ReportStatus }
  >({
    mutationFn: ({ id, status }) => updateReportStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update report");
    },
  });
};
