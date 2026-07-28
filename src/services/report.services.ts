import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreateReportPayload,
  Report,
  ReportListParams,
  ReportStatus,
} from "../types/report";

export const createReport = async (data: CreateReportPayload) => {
  const response = await api.post<ApiResponse<Report>>("/reports", data);
  return response.data;
};

export const getReports = async (params: ReportListParams) => {
  const response = await api.get<ApiResponse<Paginated<"reports", Report>>>(
    "/reports",
    { params }
  );
  return response.data;
};

export const updateReportStatus = async (id: string, status: ReportStatus) => {
  const response = await api.patch<ApiResponse<Report>>(`/reports/${id}`, {
    status,
  });
  return response.data;
};
