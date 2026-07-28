import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { UploadedFile } from "../types/upload";

export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await api.post<ApiResponse<UploadedFile[]>>(
    "/uploads",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};
