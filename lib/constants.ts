export const ACCEPTED_EXTENSIONS = [".mp4", ".mov", ".mp3", ".wav"] as const;

export const ACCEPTED_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
] as const;

export const MAX_FILE_SIZE_MB = 500;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const PROCESSING_STEPS = [
  {
    id: "extracting" as const,
    label: "Extracting audio",
    description: "Separating audio track from your media",
  },
  {
    id: "speech" as const,
    label: "Processing speech",
    description: "Running neural speech recognition",
  },
  {
    id: "language" as const,
    label: "Detecting language",
    description: "Identifying spoken language patterns",
  },
  {
    id: "generating" as const,
    label: "Generating transcript",
    description: "Building clean, punctuated text",
  },
  {
    id: "finalizing" as const,
    label: "Finalizing output",
    description: "Polishing and formatting your transcript",
  },
];

export const UPLOAD_SIMULATION_MS = 2200;
export const STEP_DURATION_MS = 1400;
