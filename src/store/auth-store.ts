"use client";

import { create } from "zustand";
import { User } from "../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;

  logout: () => void;
}

// Deliberately not persisted (no localStorage/sessionStorage): the refresh
// token now lives only in an httpOnly cookie, and the access token/user are
// rehydrated in memory on load via a silent refresh (see AuthGuard).
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,

  setAuth: (user, accessToken) => set({ user, accessToken }),

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user) => set({ user }),

  logout: () => set({ user: null, accessToken: null }),
}));
