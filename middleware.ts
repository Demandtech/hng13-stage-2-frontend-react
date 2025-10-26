import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const authRoutes = ["/auth/signin", "/auth/signup"];
const protectedRoutes = ["/dashboard", "/tickets"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;


  const decoded = accessToken ? jwt.decode(accessToken) : null;

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (decoded) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!decoded) {
 
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("from", pathname); 
    return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*", "/tickets/:path*"],
};
