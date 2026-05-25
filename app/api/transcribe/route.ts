import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  DEMO_ACCESS_COOKIE,
  isValidDemoAccessValue,
  requiresDemoAccessCookie,
} from "@/lib/demo-access-cookie";
import { trimMediaForTranscription } from "@/lib/trim-media-for-transcription";
import {
  getMaxUploadDurationSeconds,
  uploadMaxErrorMessage,
} from "@/lib/validate-upload-duration";
import { validateMediaFile } from "@/lib/validation";

export const runtime = "nodejs";
/** FFmpeg clip + Whisper; Vercel Hobby max 10s, Pro up to 60s (see vercel.json). */
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    if (requiresDemoAccessCookie()) {
      const access = request.cookies.get(DEMO_ACCESS_COOKIE)?.value;
      if (!isValidDemoAccessValue(access)) {
        return NextResponse.json(
          { error: "Demo access required. Unlock the app first." },
          { status: 401 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error ?? "Invalid file." },
        { status: 400 }
      );
    }

    const maxUploadSeconds = getMaxUploadDurationSeconds();
    const durationRaw = formData.get("durationSeconds");
    if (durationRaw != null && String(durationRaw).trim() !== "") {
      const duration = Number.parseFloat(String(durationRaw));
      if (Number.isFinite(duration) && duration > maxUploadSeconds) {
        return NextResponse.json(
          { error: uploadMaxErrorMessage(maxUploadSeconds) },
          { status: 400 }
        );
      }
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ mock: true });
    }

    const clippedFile = await trimMediaForTranscription(file);

    const openai = new OpenAI({ apiKey });
    const result = await openai.audio.transcriptions.create({
      file: clippedFile,
      model: "whisper-1",
    });

    // JSON only — transcript .txt download is client-side (Blob), never written on server.
    return NextResponse.json({
      transcript: result.text,
      mock: false,
    });
  } catch (err) {
    console.error("[transcribe]", err);
    const message =
      err instanceof Error ? err.message : "Transcription failed. Try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
