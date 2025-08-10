import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const AUTH_STORAGE_KEY = "auth-storage";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
  });

  api.interceptors.request.use((config) => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      const token = raw ? JSON.parse(raw)?.state?.token : null;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      return config;
    }
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const errorData = error.response?.data as {
        errors: string[];
        message: string;
      };
      const message = errorData?.message || "An error occurred";

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem(AUTH_STORAGE_KEY);
        window.location.href = "/auth/login";
      } else {
        toast.error(message);
      }

      return Promise.reject(
        new ApiError(message, error.response?.status || 500, errorData?.errors)
      );
    }
  );

  return api;
};

export const api = createApiClient();
