"use client";
import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);

      // Simpan token ke Zustand store
      login(data.content.token, {
        email: email,
        name: data.content.user.fullName,
      });

      // Simpan token ke cookie untuk middleware
      document.cookie = `auth-storage=${JSON.stringify({
        state: {
          token: data.content.token,
          user: {
            email: email,
            name: data.content.user.fullName,
          },
          isAuthenticated: true,
        },
      })}; path=/; max-age=86400; secure; samesite=strict`;

      toast.success("Login sukses!");

      // Simplified redirect logic
      const redirectPath =
        email === "admin@nodewave.id" ? "/admin" : "/dashboard";

      // Small delay to ensure cookie is set
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh(); // Force refresh to trigger middleware
      }, 100);
    } catch (err: any) {
      toast.error(
        "Gagal login: " + (err?.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
