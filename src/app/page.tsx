"use client";

import { useState, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import Results from "@/components/Results";
import { processFiles, type ProcessingResult } from "@/lib/processor";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ stage: "", progress: 0, detail: "" });
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleFilesReady = useCallback(
    async (files: Array<{ name: string; content: string }>) => {
      setIsProcessing(true);
      setResult(null);

      try {
        const result = await processFiles(files, (stage, prog, detail) => {
          setProgress({ stage, progress: prog, detail: detail || "" });
        });
        setResult(result);
      } catch (e) {
        console.error("Processing failed:", e);
        setProgress({
          stage: "Error",
          progress: 0,
          detail: e instanceof Error ? e.message : "Unknown error",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          OpenAPI Spec Fixer
        </h1>
        <p className="text-gray-400">
          Upload your OpenAPI specification files. The tool will validate, fix, and
          separate them into dedicated per-subsection YAML files.
        </p>
      </div>

      <div className="space-y-6">
        <FileUpload onFilesReady={handleFilesReady} isProcessing={isProcessing} />

        {isProcessing && (
          <ProgressBar
            stage={progress.stage}
            progress={progress.progress}
            detail={progress.detail}
          />
        )}

        {result && !isProcessing && <Results result={result} />}
      </div>
    </main>
  );
}
