import { NextRequest, NextResponse } from "next/server";

interface AuthState {
  token?: string;
  user?: {
    email?: string;
    name?: string;
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

  // Parse and validate auth storage
  let isAuthenticated = false;
  let token: string | null = null;
  let userEmail: string | null = null;

  if (authStorage) {
    try {
      const parsedAuth: AuthStorage = JSON.parse(authStorage);
      const state = parsedAuth.state;

      if (state) {
        token = state.token || null;
        userEmail = state.user?.email || null;
        isAuthenticated = Boolean(state.isAuthenticated && token);
      }
    } catch (error) {
      console.log("Error parsing auth cookie:", error);
      // Clear invalid cookie
      const response = NextResponse.next();
      response.cookies.delete("auth-storage");
    }
  }

  // Protect admin routes
  if (url.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect dashboard routes
  if (url.pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login page
  if (url.pathname === "/auth/login" && isAuthenticated) {
    // Check for redirect parameter first
    const redirectParam = url.searchParams.get("redirect");
    if (
      redirectParam &&
      (redirectParam.startsWith("/admin") ||
        redirectParam.startsWith("/dashboard"))
    ) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }

    const redirectPath =
      userEmail === "admin@nodewave.id" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/login"],
};
