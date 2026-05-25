"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { downloadTextFile } from "@/lib/download-text-file";
import { copyToClipboard } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface TranscriptActionsProps {
  text: string;
  downloadFilename: string;
}

export function TranscriptActions({
  text,
  downloadFilename,
}: TranscriptActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadTextFile(downloadFilename, text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.4 }}
      className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <Button
        variant="primary"
        onClick={handleCopy}
        className="flex-1 sm:flex-initial"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Copied to clipboard
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy transcript
          </>
        )}
      </Button>
      <Button
        variant="secondary"
        onClick={handleDownload}
        className="flex-1 sm:flex-initial"
      >
        <Download className="h-3.5 w-3.5" />
        Download .txt
      </Button>
      <Button
        variant="ghost"
        disabled
        className="hidden flex-1 sm:flex sm:flex-initial"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </Button>
    </motion.div>
  );
}
