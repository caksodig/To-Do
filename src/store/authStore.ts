import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  syncToCookie: () => void;
}

const setCookie = (name: string, value: string, days: number = 1) => {
  if (typeof document !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }
};

const removeCookie = (name: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        const newState = {
          token,
          user,
          isAuthenticated: true,
        };

        set(newState);

        // Sync to cookie for middleware
        setCookie("auth-storage", JSON.stringify({ state: newState }));
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });

        // Remove cookie
        removeCookie("auth-storage");
      },

      syncToCookie: () => {
        const state = get();
        if (state.isAuthenticated && state.token) {
          setCookie(
            "auth-storage",
            JSON.stringify({
              state: {
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
              },
            })
          );
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Sync to cookie when store rehydrates
        if (state?.isAuthenticated && state?.token) {
          setCookie(
            "auth-storage",
            JSON.stringify({
              state: {
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
              },
            })
          );
        }
      },
    }
  )
);
