/**
 * Spec loader: parses uploaded YAML/JSON files and extracts endpoints.
 */
import yaml from "js-yaml";

export interface EndpointDef {
  /** The path key as it appears in the spec (e.g., "/customers/{id}") */
  path: string;
  /** HTTP method (get, post, put, delete, patch) */
  method: string;
  /** The full operation definition from the spec */
  operation: Record<string, unknown>;
  /** Source filename for priority/dedup */
  sourceFile: string;
  /** The full path including server base for classification */
  fullPath: string;
}

export interface ParsedSpec {
  /** Raw parsed spec object */
  raw: Record<string, unknown>;
  /** OpenAPI version */
  openApiVersion: string;
  /** Spec title */
  title: string;
  /** Server base path extracted from servers array */
  serverBasePath: string;
  /** All endpoints extracted */
  endpoints: EndpointDef[];
  /** Source filename */
  sourceFile: string;
  /** Shared components (schemas, securitySchemes, etc.) */
  components: Record<string, unknown>;
  /** Security definitions */
  security: unknown[];
}

const HTTP_METHODS = ["get", "post", "put", "delete", "patch", "head", "options", "trace"];

/**
 * Parse a single file (YAML or JSON) into a structured spec.
 */
export function parseSpecFile(content: string, filename: string): ParsedSpec | null {
  let parsed: Record<string, unknown>;

  try {
    if (filename.endsWith(".json")) {
      parsed = JSON.parse(content);
    } else {
      parsed = yaml.load(content) as Record<string, unknown>;
    }
  } catch (e) {
    console.warn(`Failed to parse ${filename}:`, e);
    return null;
  }

  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  // Must have paths to be a valid OpenAPI spec
  const paths = parsed.paths as Record<string, Record<string, unknown>> | undefined;
  if (!paths || typeof paths !== "object") {
    return null;
  }

  const openApiVersion = String(parsed.openapi || parsed.swagger || "3.0.1");
  const info = (parsed.info || {}) as Record<string, unknown>;
  const title = String(info.title || filename);
  const serverBasePath = extractServerBasePath(parsed);
  const components = (parsed.components || {}) as Record<string, unknown>;
  const security = (parsed.security || []) as unknown[];

  const endpoints: EndpointDef[] = [];

  for (const [pathKey, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method] as Record<string, unknown> | undefined;
      if (!operation) continue;

      // Build the full path for classification
      // If the path already starts with the server base, don't double it
      let fullPath = pathKey;
      if (serverBasePath && serverBasePath !== "/" && !pathKey.startsWith(serverBasePath)) {
        // Check if the path looks like it already includes a version prefix
        if (!pathKey.match(/^\/(v\d|api_gateway|auth|das|mobile|coupon|upload|loyalty|x)\//)) {
          fullPath = serverBasePath + pathKey;
        }
      }

      endpoints.push({
        path: pathKey,
        method,
        operation: { ...operation },
        sourceFile: filename,
        fullPath,
      });
    }
  }

  return {
    raw: parsed,
    openApiVersion,
    title,
    serverBasePath,
    endpoints,
    sourceFile: filename,
    components,
    security,
  };
}

/**
 * Extract the base path from the servers array.
 */
function extractServerBasePath(spec: Record<string, unknown>): string {
  const servers = spec.servers as Array<{ url?: string }> | undefined;
  if (!servers || !servers.length) return "";

  const url = servers[0]?.url || "";
  // Extract path from URL like "https://{host}/v2" → "/v2"
  try {
    // Handle template URLs
    const cleaned = url.replace(/\{[^}]+\}/g, "placeholder");
    if (cleaned.includes("://")) {
      const urlObj = new URL(cleaned);
      const path = urlObj.pathname;
      return path === "/" ? "" : path;
    }
    // If it's just a path
    return url.startsWith("/") ? url : "";
  } catch {
    // If URL parsing fails, try to extract path manually
    const match = url.match(/https?:\/\/[^/]+(\/.*)/);
    if (match) {
      const path = match[1].replace(/\{[^}]+\}/g, "");
      return path === "/" ? "" : path;
    }
    return "";
  }
}

/**
 * Parse multiple uploaded files and return all parsed specs.
 */
export function parseAllFiles(
  files: Array<{ name: string; content: string }>
): ParsedSpec[] {
  const specs: ParsedSpec[] = [];

  for (const file of files) {
    const spec = parseSpecFile(file.content, file.name);
    if (spec) {
      specs.push(spec);
    }
  }

  return specs;
}
