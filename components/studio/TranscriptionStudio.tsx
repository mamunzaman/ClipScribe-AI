"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranscriptionFlow } from "@/hooks/use-transcription-flow";
import { Hero } from "@/components/landing/Hero";
import { DropZone } from "@/components/upload/DropZone";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { ProcessingSteps } from "@/components/upload/ProcessingSteps";
import { TranscriptResultView } from "@/components/transcript/TranscriptResult";
import { cn } from "@/lib/utils";

const workflowEase = [0.22, 1, 0.36, 1] as const;

export function TranscriptionStudio() {
  const {
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
  } = useTranscriptionFlow();

  const showLanding = view === "landing";
  const busy = view === "uploading" || view === "processing";
  const inWorkflow = view !== "landing";

  const handleFile = (file: File) => {
    setError(null);
    void processFile(file);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLanding && (
          <motion.div
            key="landing"
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: workflowEase }}
          >
            <Hero />
          </motion.div>
        )}
      </AnimatePresence>

      <section
        className={cn(
          "mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24",
          inWorkflow ? "pt-6 sm:pt-8" : "pt-4"
        )}
      >
        <div
          className={cn(
            inWorkflow &&
              "mx-auto min-h-[min(520px,70vh)] max-w-3xl transition-[min-height] duration-300"
          )}
        >
          <AnimatePresence mode="wait">
            {view === "landing" && (
              <motion.div
                key={`drop-${sessionKey}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: workflowEase }}
              >
                <DropZone
                  onFileSelect={handleFile}
                  error={error}
                  disabled={busy}
                />
              </motion.div>
            )}

            {view === "uploading" && fileInfo && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: workflowEase }}
              >
                <UploadProgress
                  progress={uploadProgress}
                  fileName={fileInfo.name}
                  fileSize={fileInfo.size}
                />
              </motion.div>
            )}

            {view === "processing" && fileInfo && (
              <motion.div
                key="process"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: workflowEase }}
              >
                <ProcessingSteps
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  fileName={fileInfo.name}
                />
              </motion.div>
            )}

          {view === "result" && transcript && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: workflowEase }}
            >
                <TranscriptResultView result={transcript} onReset={reset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
