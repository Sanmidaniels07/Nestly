"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadFiles } from "../services/upload.services";

// Kept as a single-file convenience wrapper around POST /api/uploads (which
// always accepts an array) so existing call sites — product image upload,
// store logo/banner — didn't need to change when uploads moved off direct
// client-to-Cloudinary and onto the backend-mediated endpoint.
const uploadSingleImage = async (file: File) => {
  const response = await uploadFiles([file]);
  return response.data[0].url;
};

export const useImageUpload = () =>
  useMutation({
    mutationFn: uploadSingleImage,
    onError: () => toast.error("Image upload failed"),
  });
