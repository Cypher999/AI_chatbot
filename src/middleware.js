import { NextResponse } from "next/server";
import getToken  from "@/utils/getToken";

export async function middleware(req) {
    const token = await getToken(req);
  if (!token) {
    if (req.nextUrl.pathname.startsWith("/admin")||req.nextUrl.pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (req.nextUrl.pathname.startsWith("/api/admin")||req.nextUrl.pathname.startsWith("/api/user")) {
      return NextResponse.json({error:'not found'}, { status: 404 });
  }
  }
  if (req.nextUrl.pathname.startsWith("/admin") && token.role === "user") {
    return NextResponse.redirect(new URL("/user", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/api/admin") && token.role === "user") {
    return NextResponse.json({error:'not found'}, { status: 404 });
  }
  return NextResponse.next(); 
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*","/api/user/:path*", "/user/:path*"], // Protect these routes
};
