import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/service/auth.service";
import { toast } from "sonner";
import { User } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { token, user, login: setAuth, logout: clearAuth } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);

      setAuth(response.content.token, response.content.user);
      toast.success("Login successful!");

      // Redirect based on role
      if (response.content.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      await AuthService.register(fullName, email, password);
      toast.success("Registration successful! Please login.");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };
}
