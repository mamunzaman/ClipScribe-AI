import { PAYLOAD_TOO_LARGE_MESSAGE } from "@/lib/upload-size";

export type TranscribeApiResponse =
  | { mock: true }
  | { transcript: string; mock: false }
  | { error: string };

export async function parseTranscribeResponse(
  res: Response
): Promise<TranscribeApiResponse> {
  if (res.status === 413) {
    throw new Error(PAYLOAD_TOO_LARGE_MESSAGE);
  }

  const text = await res.text();

  if (!res.ok) {
    let message = "Transcription failed. Please try again.";
    if (text) {
      try {
        const data = JSON.parse(text) as { error?: string };
        if (typeof data.error === "string") message = data.error;
      } catch {
        if (text.length < 200) message = text;
      }
    }
    throw new Error(message);
  }

  if (!text.trim()) {
    throw new Error("Empty response from transcription service.");
  }

  try {
    return JSON.parse(text) as TranscribeApiResponse;
  } catch {
    throw new Error("Invalid response from transcription service.");
  }
}
