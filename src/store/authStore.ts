// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import Cookies from "js-cookie";

// interface AuthState {
//   token: string | null;
//   user: {
//     email: string;
//     name: string;
//   } | null;
//   login: (token: string, user: { email: string; name: string }) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       token: null,
//       user: null,
//       login: (token, user) => {
//         Cookies.set("token", token);
//         set({ token, user });
//       },
//       logout: () => {
//         Cookies.remove("token");
//         set({ token: null, user: null });
//       },
//     }),
//     {
//       name: "auth-storage",
//     }
//   )
// );

// store/authStore.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface AuthState {
//   token: string | null;
//   user: { email: string; name: string } | null;
//   login: (token: string, user: { email: string; name: string }) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       token: null,
//       user: null,
//       login: (token, user) => set({ token, user }),
//       logout: () => set({ token: null, user: null }),
//     }),
//     {
//       name: "auth-storage",
//     }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  syncToCookie: () => void;
}

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 1) => {
  if (typeof document !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }
};

// Helper function to remove cookie
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
