import { ACCEPTED_EXTENSIONS } from "@/lib/constants";
import { DEFAULT_TRANSCRIBE_CLIP_SECONDS } from "@/lib/transcribe-clip";

export const DEFAULT_MAX_UPLOAD_DURATION_SECONDS = 300;

export type UploadDurationValidationResult = {
  valid: boolean;
  durationSeconds?: number;
  maxDurationSeconds: number;
  error?: string;
};

export function getMaxUploadDurationSeconds(): number {
  const raw = process.env.NEXT_PUBLIC_MAX_UPLOAD_DURATION_SECONDS;
  const parsed = Number.parseInt(String(raw ?? ""), 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return DEFAULT_MAX_UPLOAD_DURATION_SECONDS;
}

export function getTranscribeClipSecondsForDisplay(): number {
  return DEFAULT_TRANSCRIBE_CLIP_SECONDS;
}

export function formatUploadMaxLabel(maxSeconds: number): string {
  if (maxSeconds >= 60 && maxSeconds % 60 === 0) {
    const minutes = maxSeconds / 60;
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }
  return `${maxSeconds} seconds`;
}

export function uploadMaxErrorMessage(maxDurationSeconds: number): string {
  const label = formatUploadMaxLabel(maxDurationSeconds);
  return `Demo mode supports uploads up to ${label}. Please choose a shorter file.`;
}

function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ext === ".mp4" || ext === ".mov";
}

export function getMediaDurationSeconds(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement(isVideoFile(file) ? "video" : "audio");
    el.preload = "metadata";
    el.muted = true;

    let settled = false;
    const finish = (value: number | null) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      el.removeAttribute("src");
      el.load();
      resolve(value);
    };

    const timeout = window.setTimeout(() => finish(null), 12_000);

    el.onloadedmetadata = () => {
      window.clearTimeout(timeout);
      const d = el.duration;
      if (!Number.isFinite(d) || d <= 0) finish(null);
      else finish(d);
    };

    el.onerror = () => {
      window.clearTimeout(timeout);
      finish(null);
    };

    el.src = url;
  });
}

export async function validateUploadDuration(
  file: File
): Promise<UploadDurationValidationResult> {
  const maxDurationSeconds = getMaxUploadDurationSeconds();
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (
    !ACCEPTED_EXTENSIONS.includes(
      ext as (typeof ACCEPTED_EXTENSIONS)[number]
    )
  ) {
    return { valid: true, maxDurationSeconds };
  }

  const durationSeconds = await getMediaDurationSeconds(file);

  if (durationSeconds === null) {
    return { valid: true, maxDurationSeconds };
  }

  if (durationSeconds > maxDurationSeconds) {
    return {
      valid: false,
      durationSeconds,
      maxDurationSeconds,
      error: uploadMaxErrorMessage(maxDurationSeconds),
    };
  }

  return {
    valid: true,
    durationSeconds,
    maxDurationSeconds,
  };
}
