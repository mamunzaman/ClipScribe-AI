import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "./constants";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

export function validateMediaFile(file: File): ValidationResult {
  const ext = getExtension(file.name);

  if (!ACCEPTED_EXTENSIONS.includes(ext as (typeof ACCEPTED_EXTENSIONS)[number])) {
    return {
      valid: false,
      error: `Unsupported format. Use MP4, MOV, MP3, or WAV.`,
    };
  }

  const mimeOk =
    !file.type ||
    ACCEPTED_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MIME_TYPES)[number]) ||
    file.type.startsWith("video/") ||
    file.type.startsWith("audio/");

  if (!mimeOk && file.type) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type}).`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "File must be 25 MB or smaller for live transcription.",
    };
  }

  if (file.size === 0) {
    return { valid: false, error: "File is empty." };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
