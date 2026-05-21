export type AppView = "landing" | "uploading" | "processing" | "result";

export type ProcessingStep =
  | "extracting"
  | "speech"
  | "language"
  | "generating"
  | "finalizing";

export interface ProcessingStepInfo {
  id: ProcessingStep;
  label: string;
  description: string;
}

export interface MockSummary {
  shortSummary: string;
  keyPoints: string[];
  actionItems: string[];
}

export interface TranscriptResult {
  title: string;
  language: string;
  duration: string;
  wordCount: number;
  text: string;
  summary: MockSummary;
}

export interface UploadedFileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
}
