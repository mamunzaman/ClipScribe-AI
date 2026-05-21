import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

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
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = typeof body.password === "string" ? body.password : "";
    const expected = getDemoPassword();

    if (!expected) {
      if (isDevelopment()) {
        return NextResponse.json({ ok: true, bypass: true });
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

    if (!password || !passwordsMatch(password, expected)) {
      return NextResponse.json(
        { ok: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
