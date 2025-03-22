import getToken  from "@/utils/getToken";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = await getToken(req);

  return NextResponse.json({ token });
}
