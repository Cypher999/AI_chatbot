import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        raw: true, // Allows parsing from raw cookies
        cookieName: "ai-chatbot-token", // Set your custom cookie name here
      });
    
      console.log("API Token:", token);
  if (!token) {
    if (req.nextUrl.pathname.startsWith("/admin")||req.nextUrl.pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/login?token="+token, req.url));
    }
  }
  if ((req.nextUrl.pathname.startsWith("/admin")||req.nextUrl.pathname.startsWith("/api/admin")) && token.role === "user") {
    return NextResponse.redirect(new URL("/user", req.url));
  }
  
  return NextResponse.next(); 
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*","/api/user/:path*", "/user/:path*"], // Protect these routes
};
