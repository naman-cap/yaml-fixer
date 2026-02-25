"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import type { ProcessingResult } from "@/lib/processor";
import { previewSpec } from "@/lib/processor";

interface ResultsProps {
  result: ProcessingResult;
}

export default function Results({ result }: ResultsProps) {
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [showUnclassified, setShowUnclassified] = useState(false);

  const handleDownload = () => {
    if (result.zipBlob) {
      saveAs(result.zipBlob, "openapi-specs.zip");
    }
  };

  const handlePreview = (subsectionId: string) => {
    if (selectedSpec === subsectionId) {
      setSelectedSpec(null);
      setPreviewContent("");
      return;
    }

    const spec = result.specs.find((s) => s.subsectionId === subsectionId);
    if (spec) {
      setSelectedSpec(subsectionId);
      setPreviewContent(previewSpec(spec));
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Spec Files"
          value={result.specs.length}
          color="blue"
        />
        <StatCard
          label="Endpoints"
          value={result.stats.classified}
          color="green"
        />
        <StatCard
          label="Source Files"
          value={result.parsedFiles.length}
          color="purple"
        />
        <StatCard
          label="Unclassified"
          value={result.stats.unclassified}
          color={result.stats.unclassified > 0 ? "yellow" : "gray"}
        />
        {result.registryUpdates > 0 && (
          <StatCard
            label="Registry Matches"
            value={result.registryUpdates}
            color="green"
          />
        )}
      </div>

      {/* GitHub Sync Status */}
      {result.githubPushStatus && (
        <div className={`border rounded-lg p-4 ${result.githubPushStatus.success ? 'bg-green-950/30 border-green-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
          <h3 className={`text-sm font-medium mb-2 flex items-center gap-2 ${result.githubPushStatus.success ? 'text-green-400' : 'text-red-400'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            GitHub Sync
          </h3>
          <div className={`text-xs ${result.githubPushStatus.success ? 'text-green-300/70' : 'text-red-300/70'}`}>
            {result.githubPushStatus.success ? (
              <>
                Successfully split files and updated registry on GitHub! <a href={result.githubPushStatus.url} target="_blank" rel="noreferrer" className="underline font-semibold hover:text-green-200">View Commit here &rarr;</a>
              </>
            ) : (
              <>Upload failed: {result.githubPushStatus.error}. Make sure GITHUB_TOKEN is correctly set up.</>
            )}
          </div>
        </div>
      )}

      {/* Download */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download All ({result.specs.length} specs)
        </button>
      </div>

      {/* Failed files */}
      {result.failedFiles.length > 0 && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-400 mb-2">
            Failed to Parse ({result.failedFiles.length})
          </h3>
          <div className="text-xs text-red-300/70 space-y-1">
            {result.failedFiles.map((f) => (
              <div key={f}>{f}</div>
            ))}
          </div>
        </div>
      )}

      {/* Spec list */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Generated Specifications
        </h3>
        <div className="space-y-1">
          {result.specs.map((spec) => (
            <div key={spec.subsectionId}>
              <button
                onClick={() => handlePreview(spec.subsectionId)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left transition-colors text-sm ${selectedSpec === spec.subsectionId
                  ? "bg-blue-900/30 border border-blue-800/50"
                  : "bg-gray-900 hover:bg-gray-800/80"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-mono text-xs">
                    {spec.filename}
                  </span>
                  <span className="text-gray-300">
                    {spec.spec.info?.title}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {spec.endpointCount} endpoint
                  {spec.endpointCount !== 1 ? "s" : ""}
                </span>
              </button>

              {selectedSpec === spec.subsectionId && (
                <div className="mt-1 mb-2 ml-4">
                  <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-400 overflow-x-auto max-h-96 overflow-y-auto">
                    {previewContent}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Unclassified endpoints */}
      {result.unclassifiedPaths.length > 0 && (
        <div className="bg-yellow-950/20 border border-yellow-900/30 rounded-lg p-4">
          <button
            onClick={() => setShowUnclassified(!showUnclassified)}
            className="flex items-center gap-2 text-sm text-yellow-400/80 hover:text-yellow-400"
          >
            <span>{showUnclassified ? "v" : ">"}</span>
            Unclassified Endpoints ({result.unclassifiedPaths.length})
          </button>
          {showUnclassified && (
            <div className="mt-3 text-xs text-yellow-300/50 space-y-1 max-h-48 overflow-y-auto">
              {result.unclassifiedPaths.map((p, i) => (
                <div key={i} className="font-mono">
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    gray: "text-gray-500",
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className={`text-2xl font-bold ${colorClasses[color] || "text-gray-400"}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
