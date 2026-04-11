import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_for_development_octara",
);

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get("master_session_token");

  const protectedPaths = ["/dashboard", "/settings", "/profile"];
  const isProtectedPath = protectedPaths.some((path) =>
    url.pathname.startsWith(path),
  );

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token.value, JWT_SECRET);
      isAuthenticated = true;
    } catch (e) {
      console.error("[Proxy Hub] Session validation failed:", e);
    }
  }

  if (isProtectedPath && !isAuthenticated) {
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  const acceptLanguage = request.headers.get("accept-language") || "en";
  const locale = acceptLanguage.startsWith("fr") ? "fr" : "en";

  const response = NextResponse.next();
  response.headers.set("x-next-intl-locale", locale);
  response.headers.set("x-pathname", url.pathname);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
