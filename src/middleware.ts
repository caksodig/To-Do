import { NextRequest, NextResponse } from "next/server";

interface AuthState {
  token?: string;
  user?: {
    email?: string;
    name?: string;
    role?: "ADMIN" | "USER";
  };
  isAuthenticated?: boolean;
}

interface AuthStorage {
  state?: AuthState;
}

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth-storage");
  const authStorage = authCookie?.value;
  const url = request.nextUrl;

  let response = NextResponse.next();
  let isAuthenticated = false;
  let token: string | null = null;

  if (authStorage) {
    try {
      const parsedAuth: AuthStorage = JSON.parse(authStorage);
      const state = parsedAuth?.state;

      if (state?.isAuthenticated && state.token) {
        token = state.token;
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("❌ Error parsing auth-storage cookie:", error);
      response = NextResponse.next();
      response.cookies.delete("auth-storage");
      return response;
    }
  }

  // Protect /admin route
  if (url.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /dashboard route
  if (url.pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from /auth/login
  if (url.pathname === "/auth/login" && isAuthenticated) {
    const redirectParam = url.searchParams.get("redirect");

    if (
      redirectParam &&
      (redirectParam.startsWith("/admin") ||
        redirectParam.startsWith("/dashboard"))
    ) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/login"],
};
