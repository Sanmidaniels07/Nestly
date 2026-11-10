"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { detectStateFromCoords, getNigerianStates, getStateLocations, searchPlaces } from "../services/location.services";

// Static reference data - cache it for the session.
const ONE_DAY = 24 * 60 * 60 * 1000;

export const useNigerianStates = () =>
  useQuery({
    queryKey: ["locations", "states"],
    queryFn: getNigerianStates,
    select: (response) => response.data,
    staleTime: ONE_DAY,
  });

export const useStateLocations = (state?: string | null) =>
  useQuery({
    queryKey: ["locations", "state", state],
    queryFn: () => getStateLocations(state as string),
    select: (response) => response.data,
    enabled: !!state,
    staleTime: ONE_DAY,
    retry: false,
  });

// Areas, cities and states matching what the buyer typed ("Shop near you").
// Empty text gives the places with the most sellers.
export const usePlaceSearch = (q: string, enabled = true) =>
  useQuery({
    queryKey: ["locations", "search", q],
    queryFn: () => searchPlaces(q),
    select: (response) => response.data,
    enabled,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

const getBrowserPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Location isn't available on this device. Pick your state instead."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      reject(
        new Error(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was blocked. Allow it in your browser, or pick your state instead."
            : "Couldn't get your location. Pick your state instead."
        )
      );
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 });
  });

// Browser location -> Nigerian state, plus the area and city when known (looked up by the backend).
export const useDetectState = () =>
  useMutation({
    mutationFn: async () => {
      const position = await getBrowserPosition();
      const response = await detectStateFromCoords(position.coords.latitude, position.coords.longitude);
      return response.data;
    },
  });
