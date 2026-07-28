"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createReport } from "../services/report.services";
import { ApiErrorResponse } from "../types/api";
import { CreateReportPayload } from "../types/report";

export const useCreateReport = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateReportPayload>({
    mutationFn: createReport,

    onSuccess: () => {
      toast.success("Report submitted. Thanks for helping keep Nestly safe.");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to submit report");
    },
  });
};
