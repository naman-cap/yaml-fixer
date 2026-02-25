"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onFilesReady: (files: Array<{ name: string; content: string }>) => void;
  isProcessing: boolean;
}

export default function FileUpload({
  onFilesReady,
  isProcessing,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [loadedFiles, setLoadedFiles] = useState<
    Array<{ name: string; content: string }>
  >([]);

  const readFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(
        (f) =>
          f.name.endsWith(".yaml") ||
          f.name.endsWith(".yml") ||
          f.name.endsWith(".json")
      );

      if (files.length === 0) return;

      const results: Array<{ name: string; content: string }> = [];

      for (const file of files) {
        try {
          const content = await file.text();
          results.push({ name: file.name, content });
        } catch (e) {
          console.warn(`Failed to read ${file.name}:`, e);
        }
      }

      const combined = [...loadedFiles, ...results];
      // Deduplicate by filename
      const deduped = Array.from(
        new Map(combined.map((f) => [f.name, f])).values()
      );

      setLoadedFiles(deduped);
      setFileCount(deduped.length);
    },
    [loadedFiles]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const items = e.dataTransfer.items;
      const files: File[] = [];

      // Handle directory drops
      const processEntry = async (
        entry: FileSystemEntry
      ): Promise<void> => {
        if (entry.isFile) {
          const fileEntry = entry as FileSystemFileEntry;
          return new Promise((resolve) => {
            fileEntry.file((file) => {
              if (
                file.name.endsWith(".yaml") ||
                file.name.endsWith(".yml") ||
                file.name.endsWith(".json")
              ) {
                files.push(file);
              }
              resolve();
            });
          });
        } else if (entry.isDirectory) {
          const dirReader = (
            entry as FileSystemDirectoryEntry
          ).createReader();
          return new Promise((resolve) => {
            dirReader.readEntries(async (entries) => {
              for (const e of entries) {
                await processEntry(e);
              }
              resolve();
            });
          });
        }
      };

      if (items) {
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry();
          if (entry) {
            await processEntry(entry);
          }
        }
      }

      if (files.length > 0) {
        await readFiles(files);
      } else {
        // Fallback to regular file drop
        await readFiles(e.dataTransfer.files);
      }
    },
    [readFiles]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        await readFiles(e.target.files);
      }
    },
    [readFiles]
  );

  const handleProcess = () => {
    if (loadedFiles.length > 0) {
      onFilesReady(loadedFiles);
    }
  };

  const handleClear = () => {
    setLoadedFiles([]);
    setFileCount(0);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all
          ${
            isDragOver
              ? "border-blue-400 bg-blue-400/10"
              : "border-gray-700 hover:border-gray-500"
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-12 h-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div>
            <p className="text-lg text-gray-300">
              Drop your OpenAPI spec files or folders here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports .yaml, .yml, and .json files
            </p>
          </div>
          <label className="cursor-pointer px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
            Browse Files
            <input
              type="file"
              multiple
              accept=".yaml,.yml,.json"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>

      {fileCount > 0 && (
        <div className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-gray-300">
              {fileCount} file{fileCount !== 1 ? "s" : ""} loaded
            </span>
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-300 underline"
            >
              Clear
            </button>
          </div>
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isProcessing
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }
            `}
          >
            {isProcessing ? "Processing..." : "Fix & Separate"}
          </button>
        </div>
      )}
    </div>
  );
}
