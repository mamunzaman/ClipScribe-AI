import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { MIN_DURATION_ERROR, MIN_DURATION_SECONDS } from "@/lib/constants";
import { validateMediaFile } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
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

    const durationRaw = formData.get("durationSeconds");
    if (durationRaw != null && String(durationRaw).trim() !== "") {
      const duration = Number.parseFloat(String(durationRaw));
      if (Number.isFinite(duration) && duration < MIN_DURATION_SECONDS) {
        return NextResponse.json({ error: MIN_DURATION_ERROR }, { status: 400 });
      }
    }
    // TODO: Server-side duration via ffmpeg/ffprobe when client metadata is unavailable.

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ mock: true });
    }

    const openai = new OpenAI({ apiKey });
    const result = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

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
