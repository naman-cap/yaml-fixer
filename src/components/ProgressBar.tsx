"use client";

interface ProgressBarProps {
  stage: string;
  progress: number;
  detail?: string;
}

export default function ProgressBar({ stage, progress, detail }: ProgressBarProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300 font-medium">{stage}</span>
        <span className="text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {detail && (
        <p className="text-xs text-gray-500">{detail}</p>
      )}
    </div>
  );
}
