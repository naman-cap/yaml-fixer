/**
 * Main processing pipeline: orchestrates loading, classifying,
 * building, and output generation.
 */
import { parseAllFiles, type ParsedSpec } from "./loader";
import { classifyAll, type ClassificationResult } from "./classifier";
import { buildAllSpecs, type BuiltSpec } from "./builder";
import { createZip, specToYaml } from "./writer";

export interface ProcessingResult {
  /** Built specs ready for download */
  specs: BuiltSpec[];
  /** Classification stats */
  stats: ClassificationResult["stats"];
  /** Unclassified endpoint paths (for debugging) */
  unclassifiedPaths: string[];
  /** Source files that were successfully parsed */
  parsedFiles: string[];
  /** Source files that failed to parse */
  failedFiles: string[];
  /** ZIP blob for download */
  zipBlob: Blob | null;
}

export interface ProgressCallback {
  (stage: string, progress: number, detail?: string): void;
}

/**
 * Process uploaded files end-to-end.
 */
export async function processFiles(
  files: Array<{ name: string; content: string }>,
  onProgress?: ProgressCallback
): Promise<ProcessingResult> {
  onProgress?.("Parsing files", 0, `Loading ${files.length} files...`);

  // Step 1: Parse all uploaded files
  const specs: ParsedSpec[] = parseAllFiles(files);

  const parsedFiles = specs.map((s) => s.sourceFile);
  const failedFiles = files
    .map((f) => f.name)
    .filter((name) => !parsedFiles.includes(name));

  onProgress?.(
    "Parsing files",
    20,
    `Parsed ${parsedFiles.length} specs, ${failedFiles.length} failed`
  );

  if (specs.length === 0) {
    return {
      specs: [],
      stats: { total: 0, classified: 0, unclassified: 0, subsectionCounts: {} },
      unclassifiedPaths: [],
      parsedFiles: [],
      failedFiles: files.map((f) => f.name),
      zipBlob: null,
    };
  }

  // Step 2: Classify all endpoints
  onProgress?.("Classifying endpoints", 30, "Mapping endpoints to subsections...");
  const classification = classifyAll(specs);

  onProgress?.(
    "Classifying endpoints",
    50,
    `${classification.stats.classified} classified, ${classification.stats.unclassified} unclassified`
  );

  // Step 3: Build output specs
  onProgress?.("Building specs", 60, "Creating OpenAPI specifications...");
  const builtSpecs = buildAllSpecs(classification.grouped);

  onProgress?.(
    "Building specs",
    80,
    `Built ${builtSpecs.length} specification files`
  );

  // Step 4: Create ZIP
  onProgress?.("Creating ZIP", 85, "Packaging files...");
  const zipBlob = await createZip(builtSpecs);

  onProgress?.("Done", 100, `${builtSpecs.length} specs ready for download`);

  return {
    specs: builtSpecs,
    stats: classification.stats,
    unclassifiedPaths: classification.unclassified.map(
      (e) => `${e.method.toUpperCase()} ${e.fullPath} (from ${e.sourceFile})`
    ),
    parsedFiles,
    failedFiles,
    zipBlob,
  };
}

/**
 * Get a preview of a single spec as YAML text.
 */
export function previewSpec(spec: BuiltSpec): string {
  return specToYaml(spec.spec);
}
