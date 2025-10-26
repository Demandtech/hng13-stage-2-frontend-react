import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const authRoutes = ["/auth/signin", "/auth/signup"];
const protectedRoutes = ["/dashboard", "/tickets"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const res = NextResponse.next({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

  const accessToken = req.cookies.get("access_token")?.value;
  const decoded = accessToken ? jwt.decode(accessToken) : null;

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (decoded) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return res;
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!decoded) {
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/tickets/:path*",
    "/api/:path*",
  ],
};
