import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (isAuthRoute && token) {
    const redirectUrl = searchParams.get("redirectUrl") || "/account";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (pathname.startsWith("/account") && !token) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirectUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login", "/signup"],
};
