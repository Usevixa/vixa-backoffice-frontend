import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject auth token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — clear auth state and redirect to login.
// The logout endpoint is excluded: if it returns 401 (e.g. token already
// expired), the Header.tsx finally block handles cleanup. Letting the
// interceptor also act would cause duplicate logout() calls and competing
// redirects (window.location.href vs React Router navigate).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isLoginRoute = window.location.pathname === "/login";
    const isLogoutRequest = error?.config?.url?.includes("/auth/logout");

    if (status === 401 && !isLoginRoute && !isLogoutRequest) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
