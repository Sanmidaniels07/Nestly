"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadImage } from "../lib/cloudinary";

export const useImageUpload = () =>
  useMutation({
    mutationFn: uploadImage,
    onError: () => toast.error("Image upload failed"),
  });
