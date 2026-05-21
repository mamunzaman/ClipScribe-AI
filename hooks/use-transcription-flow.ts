"use client";

import { useCallback, useRef, useState } from "react";
import {
  PROCESSING_STEPS,
  STEP_DURATION_MS,
  UPLOAD_SIMULATION_MS,
} from "@/lib/constants";
import { generateMockTranscript } from "@/lib/mock-data";
import { validateMediaFile } from "@/lib/validation";
import type {
  AppView,
  ProcessingStep,
  TranscriptResult,
  UploadedFileInfo,
} from "@/types";

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

  const reset = useCallback(() => {
    runIdRef.current += 1;
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
    (info: UploadedFileInfo): Promise<void> =>
      new Promise((resolve) => {
        const runId = runIdRef.current;
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

  const simulateProcessing = useCallback(
    (fileName: string): Promise<TranscriptResult> =>
      new Promise((resolve) => {
        const runId = runIdRef.current;
        setView("processing");
        setCompletedSteps([]);
        let index = 0;

        const runStep = () => {
          if (runId !== runIdRef.current) return;
          const step = PROCESSING_STEPS[index];
          if (!step) {
            const result = generateMockTranscript(fileName);
            setTranscript(result);
            setView("result");
            resolve(result);
            return;
          }
          setCurrentStep(step.id);
          setTimeout(() => {
            if (runId !== runIdRef.current) return;
            setCompletedSteps((prev) => [...prev, step.id]);
            index += 1;
            runStep();
          }, STEP_DURATION_MS);
        };
        runStep();
      }),
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

      runIdRef.current += 1;
      const runId = runIdRef.current;

      const info: UploadedFileInfo = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setFileInfo(info);

      await simulateUpload(info);
      if (runId !== runIdRef.current) return;
      await simulateProcessing(info.name);
    },
    [simulateUpload, simulateProcessing]
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
