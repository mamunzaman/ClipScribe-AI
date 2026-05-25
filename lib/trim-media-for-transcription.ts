import { randomBytes } from "crypto";
import { spawn } from "child_process";
import { readFile, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { resolveFfmpegPath } from "@/lib/ffmpeg-path";
import { getTranscribeClipSeconds } from "@/lib/transcribe-clip";

function extensionFromName(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

async function runFfmpeg(
  ffmpegPath: string,
  inputPath: string,
  outputPath: string,
  clipSeconds: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i",
      inputPath,
      "-t",
      String(clipSeconds),
      "-vn",
      "-ar",
      "16000",
      "-ac",
      "1",
      "-c:a",
      "libmp3lame",
      "-q:a",
      "4",
      outputPath,
    ];

    const proc = spawn(ffmpegPath, args, {
      stdio: ["ignore", "ignore", "pipe"],
      windowsHide: true,
    });

    let stderr = "";

    proc.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      const isMissing =
        err.message.includes("ENOENT") || (err as NodeJS.ErrnoException).code === "ENOENT";
      reject(
        new Error(
          isMissing
            ? "Audio clipping is unavailable. FFmpeg could not be started (bundled binary and system PATH both failed)."
            : err.message
        )
      );
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      const detail = stderr.trim().slice(-400);
      reject(
        new Error(
          detail
            ? `FFmpeg failed to prepare audio clip (code ${code ?? "unknown"}): ${detail}`
            : `FFmpeg failed to prepare audio clip (code ${code ?? "unknown"}).`
        )
      );
    });
  });
}

/**
 * Extracts only the first N seconds of audio for Whisper (never sends full long files).
 */
export async function trimMediaForTranscription(
  file: File,
  clipSeconds = getTranscribeClipSeconds()
): Promise<File> {
  const ffmpegPath = await resolveFfmpegPath();
  const id = randomBytes(8).toString("hex");
  const ext = extensionFromName(file.name) || ".bin";
  const inputPath = join(tmpdir(), `clipscribe-in-${id}${ext}`);
  const outputPath = join(tmpdir(), `clipscribe-out-${id}.mp3`);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(inputPath, buffer);

  try {
    await runFfmpeg(ffmpegPath, inputPath, outputPath, clipSeconds);
    const outBuffer = await readFile(outputPath);
    const baseName = file.name.replace(/\.[^.]+$/, "") || "clip";
    return new File([outBuffer], `${baseName}-clip.mp3`, {
      type: "audio/mpeg",
    });
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}
