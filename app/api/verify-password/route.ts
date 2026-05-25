import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  attachDemoAccessCookie,
  requiresDemoAccessCookie,
} from "@/lib/demo-access-cookie";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

function getDemoPassword(): string | undefined {
  const value = process.env.DEMO_PASSWORD?.trim();
  return value || undefined;
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

function passwordsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function GET() {
  const configured = Boolean(getDemoPassword());
  const required = configured || !isDevelopment();

  return NextResponse.json({
    required,
    configured,
    turnstileConfigured: isTurnstileConfigured(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      password?: string;
      turnstileToken?: string;
    };
    const password = typeof body.password === "string" ? body.password : "";
    const turnstileToken =
      typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const expected = getDemoPassword();

    if (!expected) {
      if (isDevelopment()) {
        const response = NextResponse.json({ ok: true, bypass: true });
        if (!requiresDemoAccessCookie()) return response;
        return attachDemoAccessCookie(response);
      }
      return NextResponse.json(
        {
          ok: false,
          error:
            "Demo password is not configured. Set DEMO_PASSWORD in the environment.",
        },
        { status: 503 }
      );
    }

    if (isTurnstileConfigured()) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        undefined;
      const captchaOk = await verifyTurnstileToken(turnstileToken, ip);
      if (!captchaOk) {
        return NextResponse.json(
          { ok: false, error: "CAPTCHA verification failed" },
          { status: 403 }
        );
      }
    } else if (!isDevelopment()) {
      return NextResponse.json(
        {
          ok: false,
          error: "CAPTCHA is not configured on the server.",
        },
        { status: 503 }
      );
    }

    if (!password || !passwordsMatch(password, expected)) {
      return NextResponse.json(
        { ok: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    return attachDemoAccessCookie(response);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
