import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true, // Allows parsing from raw cookies
    cookieName: "ai-chatbot-token", // Set your custom cookie name here
  });

  return NextResponse.json({ token });
}
