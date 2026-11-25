"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createCollection, deleteCollection, getMyCollections, updateCollection } from "../services/collection.services";
import { ApiErrorResponse } from "../types/api";
import { CollectionPayload } from "../types/collection";

const KEY = ["collections", "me"];
const failed = (fallback: string) => (error: AxiosError<ApiErrorResponse>) => toast.error(error.response?.data?.message ?? fallback);

export const useMyCollections = () => useQuery({ queryKey: KEY, queryFn: getMyCollections });

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CollectionPayload) => createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      toast.success("Collection ready to share");
    },
    onError: failed("Couldn't create the collection."),
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CollectionPayload> & { isActive?: boolean } }) => updateCollection(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    onError: failed("Couldn't save the collection."),
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      toast.success("Collection deleted");
    },
    onError: failed("Couldn't delete the collection."),
  });
};
