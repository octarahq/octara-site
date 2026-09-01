import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (e: unknown /* eslint-disable-line @typescript-eslint/no-unused-vars */) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isOnboardingRoute = pathname === "/onboarding";

  if (token) {
    const claims = decodeJwtPayload(token);
    const hasUsername = claims && claims.username && claims.username !== "";

    if (!hasUsername && !isOnboardingRoute && pathname.startsWith("/account")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (hasUsername && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    if (isAuthRoute) {
      const redirectUrl = searchParams.get("redirectUrl") || "/account";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } else {
    if (pathname.startsWith("/account") || isOnboardingRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login", "/signup", "/onboarding"],
};
