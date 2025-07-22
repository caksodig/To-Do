import { api } from "./api";

export const registerUser = async (
  email: string,
  fullName: string,
  password: string
) => {
  const res = await api.post("/register", { email, fullName, password });
  return res.data;
};
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/login", { email, password });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Terjadi kesalahan saat login"
    );
  }
};
