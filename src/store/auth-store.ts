"use client";

import { create } from "zustand";
import { User } from "../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  // False until the one-time silent-refresh bootstrap (see AuthInitializer)
  // has resolved either way. Anything that renders differently for guests
  // vs. signed-in users (Navbar, AuthGuard, GuestGuard) must wait for this
  // before deciding what to show — otherwise it flashes the wrong state on
  // every hard refresh, since user/accessToken always start out null.
  isHydrated: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  setHydrated: () => void;

  logout: () => void;
}

// Deliberately not persisted (no localStorage/sessionStorage): the refresh
// token now lives only in an httpOnly cookie, and the access token/user are
// rehydrated in memory on load via a silent refresh (see AuthInitializer).
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  setAuth: (user, accessToken) => set({ user, accessToken }),

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user) => set({ user }),

  setHydrated: () => set({ isHydrated: true }),

  logout: () => set({ user: null, accessToken: null }),
}));
