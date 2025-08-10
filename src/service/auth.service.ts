import { api } from "./api.service";
import { LoginResponse, RegisterResponse } from "@/types";

export const AuthService = {
  loginUser: async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>("/login", {
      email,
      password,
    });
    return data;
  },

  registerUser: async (fullName: string, email: string, password: string) => {
    const { data } = await api.post<RegisterResponse>("/register", {
      fullName,
      email,
      password,
    });
    return data;
  },
};
