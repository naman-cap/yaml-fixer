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
  /** Number of endpoints matched and updated in the registry */
  registryUpdates: number;
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
      registryUpdates: 0,
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

  // Fetch registry and update endpoints
  onProgress?.("Updating Registry", 82, "Cross-referencing built specs with API Tracking Registry...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let registry: any[] | undefined;
  let registryUpdates = 0;
  try {
    const res = await fetch('/api/registry');
    if (res.ok) {
      registry = await res.json();

      // Try to match loaded endpoints against the registry
      for (const bs of builtSpecs) {
        // Iterate over endpoints inside this built file
        for (const [pathStr, pathItem] of Object.entries(bs.spec.paths || {})) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const op of Object.values(pathItem as Record<string, any>)) {
            const summary = op.summary || "";
            // Find a match in the registry
            if (registry) {
              const matched = registry.find(r => r.title && summary.toLowerCase().includes(r.title.toLowerCase()));
              if (matched && matched.status !== 'completed') {
                matched.status = 'completed';
                matched.specFile = bs.filename;
                registryUpdates++;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch/update registry:", err);
  }

  // Step 4: Create ZIP
  onProgress?.("Creating ZIP", 85, "Packaging files...");
  const zipBlob = await createZip(builtSpecs, registry);

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
    registryUpdates,
  };
}

/**
 * Get a preview of a single spec as YAML text.
 */
export function previewSpec(spec: BuiltSpec): string {
  return specToYaml(spec.spec);
}
