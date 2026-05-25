export const DEFAULT_MAX_UPLOAD_SIZE_MB = 4;

export const UPLOAD_SIZE_ERROR_MESSAGE =
  "Demo mode supports files up to 4 MB. Longer videos may need compression before upload.";

export const PAYLOAD_TOO_LARGE_MESSAGE =
  "This file is too large for the demo upload limit. Please try a smaller audio/video file.";

export function getMaxUploadSizeMb(): number {
  const raw = process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB;
  const parsed = Number.parseInt(String(raw ?? ""), 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return DEFAULT_MAX_UPLOAD_SIZE_MB;
}

export function getMaxUploadSizeBytes(): number {
  return getMaxUploadSizeMb() * 1024 * 1024;
}

export function uploadSizeErrorMessage(maxMb = getMaxUploadSizeMb()): string {
  return `Demo mode supports files up to ${maxMb} MB. Longer videos may need compression before upload.`;
}
