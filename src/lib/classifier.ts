/**
 * Classifier: assigns endpoints to subsections based on URL pattern rules.
 */
import {
  CLASSIFICATION_RULES,
  SOURCE_PRIORITY,
  DEFAULT_SOURCE_PRIORITY,
} from "./config";
import type { EndpointDef, ParsedSpec } from "./loader";

export interface ClassifiedEndpoint extends EndpointDef {
  subsection: string;
}

export interface ClassificationResult {
  /** Endpoints grouped by subsection ID */
  grouped: Record<string, ClassifiedEndpoint[]>;
  /** Endpoints that couldn't be classified */
  unclassified: EndpointDef[];
  /** Summary stats */
  stats: {
    total: number;
    classified: number;
    unclassified: number;
    subsectionCounts: Record<string, number>;
  };
}

/**
 * Classify a single endpoint path to a subsection.
 * Returns null if no rule matches.
 */
export function classifyPath(fullPath: string): string | null {
  for (const rule of CLASSIFICATION_RULES) {
    if (rule.pattern.test(fullPath)) {
      return rule.subsection;
    }
  }
  return null;
}

/**
 * Classify all endpoints from parsed specs into subsections.
 * Handles deduplication when the same path+method appears in multiple sources.
 */
export function classifyAll(specs: ParsedSpec[]): ClassificationResult {
  const grouped: Record<string, ClassifiedEndpoint[]> = {};
  const unclassified: EndpointDef[] = [];

  // Dedup map: "path|method" → best endpoint
  const seen = new Map<
    string,
    { endpoint: ClassifiedEndpoint; priority: number }
  >();

  for (const spec of specs) {
    const sourcePriority =
      SOURCE_PRIORITY[spec.sourceFile] ?? DEFAULT_SOURCE_PRIORITY;

    for (const ep of spec.endpoints) {
      const subsection = classifyPath(ep.fullPath);

      if (!subsection) {
        // Try to classify by the raw path too
        const fallback = classifyPath(ep.path);
        if (!fallback) {
          unclassified.push(ep);
          continue;
        }
        // Use fallback classification
        const classified: ClassifiedEndpoint = { ...ep, subsection: fallback };
        addToGrouped(classified, sourcePriority, seen, grouped);
        continue;
      }

      const classified: ClassifiedEndpoint = { ...ep, subsection };
      addToGrouped(classified, sourcePriority, seen, grouped);
    }
  }

  // Build stats
  let classifiedCount = 0;
  const subsectionCounts: Record<string, number> = {};
  for (const [subsection, endpoints] of Object.entries(grouped)) {
    subsectionCounts[subsection] = endpoints.length;
    classifiedCount += endpoints.length;
  }

  return {
    grouped,
    unclassified,
    stats: {
      total: classifiedCount + unclassified.length,
      classified: classifiedCount,
      unclassified: unclassified.length,
      subsectionCounts,
    },
  };
}

function addToGrouped(
  ep: ClassifiedEndpoint,
  priority: number,
  seen: Map<string, { endpoint: ClassifiedEndpoint; priority: number }>,
  grouped: Record<string, ClassifiedEndpoint[]>
) {
  const key = `${ep.subsection}|${ep.path}|${ep.method}`;
  const existing = seen.get(key);

  if (existing) {
    if (priority > existing.priority) {
      // Replace with higher priority source
      const idx = (grouped[ep.subsection] || []).findIndex(
        (e) => e.path === ep.path && e.method === ep.method
      );
      if (idx >= 0) {
        grouped[ep.subsection][idx] = ep;
      }
      seen.set(key, { endpoint: ep, priority });
    }
    // Skip lower priority duplicate
    return;
  }

  // New endpoint
  if (!grouped[ep.subsection]) {
    grouped[ep.subsection] = [];
  }
  grouped[ep.subsection].push(ep);
  seen.set(key, { endpoint: ep, priority });
}
