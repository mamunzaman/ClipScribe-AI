import {
  ACCEPTED_EXTENSIONS,
  MIN_DURATION_ERROR,
  MIN_DURATION_SECONDS,
} from "@/lib/constants";
import type { ValidationResult } from "@/lib/validation";

function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ext === ".mp4" || ext === ".mov";
}

/**
 * Reads duration from browser media metadata (client only).
 */
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

export type DurationValidationResult = ValidationResult & {
  durationSeconds?: number;
};

export async function validateMediaDuration(
  file: File
): Promise<DurationValidationResult> {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (
    !ACCEPTED_EXTENSIONS.includes(
      ext as (typeof ACCEPTED_EXTENSIONS)[number]
    )
  ) {
    return { valid: true };
  }

  const duration = await getMediaDurationSeconds(file);
  if (duration === null) {
    return { valid: true };
  }

  if (duration < MIN_DURATION_SECONDS) {
    return { valid: false, error: MIN_DURATION_ERROR };
  }

  return { valid: true, durationSeconds: duration };
}
