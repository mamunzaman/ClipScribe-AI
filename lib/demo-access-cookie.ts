import { createHmac, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

export const DEMO_ACCESS_COOKIE = "clipscribe_demo_access";
export const DEMO_ACCESS_MAX_AGE = 3600;

function cookieSecret(): string {
  return (
    process.env.TURNSTILE_SECRET_KEY?.trim() ||
    process.env.DEMO_PASSWORD?.trim() ||
    "clipscribe-dev-cookie-secret"
  );
}

export function createDemoAccessValue(): string {
  const exp = Math.floor(Date.now() / 1000) + DEMO_ACCESS_MAX_AGE;
  const sig = createHmac("sha256", cookieSecret())
    .update(`demo-access:${exp}`)
    .digest("base64url");
  return `${exp}.${sig}`;
}

export function isValidDemoAccessValue(value: string | undefined): boolean {
  if (!value) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !sig || Math.floor(Date.now() / 1000) > exp) {
    return false;
  }

  const expected = createHmac("sha256", cookieSecret())
    .update(`demo-access:${exp}`)
    .digest("base64url");

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function attachDemoAccessCookie(response: NextResponse): NextResponse {
  response.cookies.set(DEMO_ACCESS_COOKIE, createDemoAccessValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEMO_ACCESS_MAX_AGE,
  });
  return response;
}

export function clearDemoAccessCookie(response: NextResponse): NextResponse {
  response.cookies.set(DEMO_ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function requiresDemoAccessCookie(): boolean {
  const hasPassword = Boolean(process.env.DEMO_PASSWORD?.trim());
  if (!hasPassword && process.env.NODE_ENV === "development") return false;
  return true;
}
