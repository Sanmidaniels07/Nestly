"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadFiles } from "../services/upload.services";

export const useUploadFiles = () =>
  useMutation({
    mutationFn: uploadFiles,
    onError: () => toast.error("File upload failed"),
  });
