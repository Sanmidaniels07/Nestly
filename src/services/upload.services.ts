import { api } from "../lib/axios";
import { compressImages } from "../lib/compress-image";
import { ApiResponse } from "../types/api";
import { UploadedFile } from "../types/upload";

// Every upload in the app comes through here (products, posts, stories, chat,
// avatars, store logo/banner, returns), so big photos are shrunk once, here.
export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  (await compressImages(files)).forEach((file) => formData.append("files", file));

  const response = await api.post<ApiResponse<UploadedFile[]>>(
    "/uploads",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};
