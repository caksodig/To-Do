"use client";

import { useState } from "react";
import { AuthService } from "@/service/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/schema";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    // ✅ Validasi pakai Zod
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors((prev) => ({
        ...prev,
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
      }));
      return;
    }

    // ⏳ Proses login
    setIsLoading(true);

    try {
      const data = await AuthService.loginUser(email, password);

      login(data.content.token, {
        id: data.content.user.id,
        email: data.content.user.email,
        name: data.content.user.name,
        fullName: data.content.user.fullName,
        role: data.content.user.role,
      });

      const cookieValue = JSON.stringify({
        state: {
          token: data.content.token,
          user: {
            id: data.content.user.id,
            email: data.content.user.email,
            name: data.content.user.fullName,
            fullName: data.content.user.fullName,
            role: data.content.user.role,
          },
          isAuthenticated: true,
        },
      });

      const maxAge = rememberMe ? 86400 * 7 : 86400;
      document.cookie = `auth-storage=${cookieValue}; path=/; max-age=${maxAge}; secure; samesite=strict`;

      toast.success("Welcome back! Login successful");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 100);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Login failed";

      if (
        errorMessage.toLowerCase().includes("password") ||
        errorMessage.toLowerCase().includes("credential") ||
        errorMessage.toLowerCase().includes("invalid")
      ) {
        setErrors((prev) => ({
          ...prev,
          password: "Invalid email or password",
        }));
      } else if (errorMessage.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: "Email not found" }));
      } else {
        setErrors((prev) => ({ ...prev, general: errorMessage }));
      }

      toast.error("Login failed: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   setErrors({ email: "", password: "", general: "" });
  //   setIsLoading(true);

  //   const result = loginSchema.safeParse({ email, password });

  //   if (!result.success) {
  //     const fieldErrors = result.error.flatten().fieldErrors;

  //     setErrors((prev) => ({
  //       ...prev,
  //       email: fieldErrors.email?.[0] ?? "",
  //       password: fieldErrors.password?.[0] ?? "",
  //     }));
  //     return;
  //   }

  //   try {
  //     const data = await AuthService.loginUser(email, password);

  //     // Simpan token ke Zustand store
  //     login(data.content.token, {
  //       id: data.content.user.id,
  //       email: data.content.user.email,
  //       name: data.content.user.name,
  //       fullName: data.content.user.fullName,
  //       role: data.content.user.role,
  //     });

  //     // Simpan token ke cookie untuk middleware
  //     const cookieValue = JSON.stringify({
  //       state: {
  //         token: data.content.token,
  //         user: {
  //           id: data.content.user.id,
  //           email: data.content.user.email,
  //           name: data.content.user.fullName,
  //           fullName: data.content.user.fullName,
  //           role: data.content.user.role,
  //         },
  //         isAuthenticated: true,
  //       },
  //     });

  //     const maxAge = rememberMe ? 86400 * 7 : 86400; // 7 days if remember me, else 1 day
  //     document.cookie = `auth-storage=${cookieValue}; path=/; max-age=${maxAge}; secure; samesite=strict`;

  //     toast.success("Welcome back! Login successful");

  //     setTimeout(() => {
  //       router.push("/dashboard");
  //       router.refresh();
  //     }, 100);
  //   } catch (err: any) {
  //     const errorMessage =
  //       err?.response?.data?.message || err.message || "Login failed";

  //     // Check if it's a password-related error
  //     if (
  //       errorMessage.toLowerCase().includes("password") ||
  //       errorMessage.toLowerCase().includes("credential") ||
  //       errorMessage.toLowerCase().includes("invalid")
  //     ) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         password: "Invalid email or password",
  //       }));
  //     } else if (errorMessage.toLowerCase().includes("email")) {
  //       setErrors((prev) => ({ ...prev, email: "Email not found" }));
  //     } else {
  //       setErrors((prev) => ({ ...prev, general: errorMessage }));
  //     }

  //     toast.error("Login failed: " + errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold font-poppins text-[#44444F] mb-2">
            Sign In
          </h1>
          <p className="text-[#92929D] font-roboto text-lg">
            Just sign in if you have an account in here. Enjoy our Website
          </p>
        </div>

        {/* Login Card */}
        <Card className=" bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.general}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    errors.email ? "text-red-600" : "text-blue-600"
                  )}
                >
                  Your Email / Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    className={cn(
                      "pl-10 h-12 border-2 transition-all duration-200",
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    )}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    errors.password ? "text-red-600" : "text-gray-700"
                  )}
                >
                  Enter Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    className={cn(
                      "pl-10 pr-10 h-12 border-2 transition-all duration-200",
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    )}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Remember Me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                dont have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                  register.
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema, type LoginInput } from "@/lib/validations/schema";
// import { AuthService } from "@/service/auth.service";
// import { useAuthStore } from "@/store/authStore";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Card, CardContent } from "@/components/ui/card";
// import { AlertCircle, Mail, Lock } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";

// export default function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<LoginInput>({
//     resolver: zodResolver(loginSchema),
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const login = useAuthStore((state) => state.login);
//   const router = useRouter();

//   const onSubmit = async (data: LoginInput) => {
//     setIsLoading(true);

//     try {
//       const response = await AuthService.loginUser(data.email, data.password);
//       const user = response.content.user;
//       const token = response.content.token;

//       login(token, {
//         id: user.id,
//         email: user.email,
//         name: user.fullName,
//         fullName: user.fullName,
//         role: user.role,
//       });

//       const cookieValue = JSON.stringify({
//         state: {
//           token,
//           user: {
//             id: user.id,
//             email: user.email,
//             name: user.fullName,
//             fullName: user.fullName,
//             role: user.role,
//           },
//           isAuthenticated: true,
//         },
//       });

//       const maxAge = rememberMe ? 86400 * 7 : 86400;
//       document.cookie = `auth-storage=${cookieValue}; path=/; max-age=${maxAge}; secure; samesite=strict`;

//       toast.success("Welcome back!");

//       // Admin or user route
//       const isAdmin = user.email === "admin@nodewave.id";
//       router.push(isAdmin ? "/admin" : "/dashboard");
//     } catch (err: any) {
//       const errorMessage =
//         err?.response?.data?.message || err.message || "Login failed";

//       if (
//         errorMessage.toLowerCase().includes("password") ||
//         errorMessage.toLowerCase().includes("credential") ||
//         errorMessage.toLowerCase().includes("invalid")
//       ) {
//         setError("password", { message: "Invalid email or password" });
//       } else if (errorMessage.toLowerCase().includes("email")) {
//         setError("email", { message: "Email not found" });
//       } else {
//         toast.error("Login failed: " + errorMessage);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
//       <div className="w-full max-w-lg">
//         <div className="text-center mb-10">
//           <h1 className="text-5xl font-bold text-[#44444F]">Sign In</h1>
//           <p className="text-[#92929D] text-lg mt-2">
//             Just sign in if you have an account in here. Enjoy our Website
//           </p>
//         </div>

//         <Card className="bg-white/80 backdrop-blur-sm">
//           <CardContent className="p-8">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Email */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-medium text-blue-600"
//                 >
//                   Your Email / Username
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     {...register("email")}
//                     className="pl-10 h-12 border-2"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-600 text-xs flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="password"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Enter Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your password"
//                     {...register("password")}
//                     className="pl-10 pr-10 h-12 border-2"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-600 text-xs flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               {/* Remember me */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="remember"
//                     checked={rememberMe}
//                     onCheckedChange={(checked: boolean) =>
//                       setRememberMe(checked as boolean)
//                     }
//                     disabled={isLoading}
//                   />
//                   <Label
//                     htmlFor="remember"
//                     className="text-sm text-gray-700 cursor-pointer"
//                   >
//                     Remember Me
//                   </Label>
//                 </div>
//                 <button
//                   type="button"
//                   className="text-sm text-blue-500 hover:text-blue-700"
//                   disabled={isLoading}
//                 >
//                   Forgot Password?
//                 </button>
//               </div>

//               {/* Submit */}
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-12"
//               >
//                 {isLoading ? "Signing in..." : "Login"}
//               </Button>
//             </form>

//             {/* Footer */}
//             <div className="text-center mt-6">
//               <p className="text-sm text-gray-600">
//                 Don’t have an account?{" "}
//                 <Link
//                   href="/auth/register"
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   Register.
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
