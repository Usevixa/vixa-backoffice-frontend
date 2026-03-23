import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setToken: (token: string) => void;
  setUser: (user: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: (token) =>
        set({ token, isAuthenticated: true }),

      setUser: (user) =>
        set({ user }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "vixa_auth_store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
