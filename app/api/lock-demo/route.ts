import { NextResponse } from "next/server";
import { clearDemoAccessCookie } from "@/lib/demo-access-cookie";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearDemoAccessCookie(response);
}
