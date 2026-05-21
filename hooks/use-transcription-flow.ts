"use client";

import { useCallback, useRef, useState } from "react";
import {
  PROCESSING_STEPS,
  STEP_DURATION_MS,
  UPLOAD_SIMULATION_MS,
} from "@/lib/constants";
import { buildTranscriptResult } from "@/lib/build-transcript-result";
import { generateMockTranscript } from "@/lib/mock-data";
import { validateMediaFile } from "@/lib/validation";
import type {
  AppView,
  ProcessingStep,
  TranscriptResult,
  UploadedFileInfo,
} from "@/types";

type TranscribeApiResponse =
  | { mock: true }
  | { transcript: string; mock: false }
  | { error: string };

export function useTranscriptionFlow() {
  const [view, setView] = useState<AppView>("landing");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<ProcessingStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<ProcessingStep[]>([]);
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  const runIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setView("landing");
    setUploadProgress(0);
    setCurrentStep(null);
    setCompletedSteps([]);
    setFileInfo(null);
    setTranscript(null);
    setError(null);
    setSessionKey((k) => k + 1);
  }, []);

  const simulateUpload = useCallback(
    (runId: number): Promise<void> =>
      new Promise((resolve) => {
        setView("uploading");
        setUploadProgress(0);
        const start = Date.now();
        const tick = () => {
          if (runId !== runIdRef.current) return;
          const elapsed = Date.now() - start;
          const p = Math.min(
            100,
            Math.round((elapsed / UPLOAD_SIMULATION_MS) * 100)
          );
          setUploadProgress(p);
          if (p >= 100) {
            resolve();
          } else {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      }),
    []
  );

  const runProcessingSteps = useCallback(
    (runId: number): Promise<void> =>
      new Promise((resolve) => {
        setView("processing");
        setCompletedSteps([]);
        setCurrentStep(null);
        let index = 0;

        const runStep = () => {
          if (runId !== runIdRef.current) {
            resolve();
            return;
          }
          const step = PROCESSING_STEPS[index];
          if (!step) {
            setCurrentStep(null);
            resolve();
            return;
          }
          setCurrentStep(step.id);
          setTimeout(() => {
            if (runId !== runIdRef.current) {
              resolve();
              return;
            }
            setCompletedSteps((prev) => [...prev, step.id]);
            index += 1;
            runStep();
          }, STEP_DURATION_MS);
        };
        runStep();
      }),
    []
  );

  const fetchTranscription = useCallback(
    async (file: File, signal: AbortSignal): Promise<TranscribeApiResponse> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
        signal,
      });

      const data = (await res.json()) as TranscribeApiResponse;

      if (!res.ok) {
        const message =
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Transcription failed. Please try again.";
        throw new Error(message);
      }

      return data;
    },
    []
  );

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        setError(validation.error ?? "Invalid file");
        return;
      }

      abortRef.current?.abort();
      runIdRef.current += 1;
      const runId = runIdRef.current;
      const controller = new AbortController();
      abortRef.current = controller;

      const info: UploadedFileInfo = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setFileInfo(info);

      try {
        await simulateUpload(runId);
        if (runId !== runIdRef.current) return;

        const [apiData] = await Promise.all([
          fetchTranscription(file, controller.signal),
          runProcessingSteps(runId),
        ]);

        if (runId !== runIdRef.current) return;

        let result: TranscriptResult;
        if ("mock" in apiData && apiData.mock === true) {
          result = generateMockTranscript(info.name);
        } else if ("transcript" in apiData && apiData.mock === false) {
          result = buildTranscriptResult(info.name, apiData.transcript);
        } else {
          throw new Error("Unexpected response from transcription service.");
        }

        setTranscript(result);
        setView("result");
      } catch (err) {
        if (runId !== runIdRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (err instanceof Error && err.name === "AbortError") return;

        setCurrentStep(null);
        setCompletedSteps([]);
        setUploadProgress(0);
        setView("landing");
        setError(
          err instanceof Error
            ? err.message
            : "Transcription failed. Please try again."
        );
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    [simulateUpload, runProcessingSteps, fetchTranscription]
  );

  return {
    view,
    uploadProgress,
    currentStep,
    completedSteps,
    fileInfo,
    transcript,
    error,
    setError,
    processFile,
    reset,
    sessionKey,
  };
}
