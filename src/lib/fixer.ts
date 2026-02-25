/**
 * Fixer: validates OpenAPI structure, cleans up examples,
 * and ensures consistent formatting.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;

/**
 * Patterns considered sensitive in example values.
 */
const SENSITIVE_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
  /Basic\s+[A-Za-z0-9+/]+=*/gi,
  /_cfuvid=[^;'"\s]+/g,
  /Cookie:\s*[^'"]+/gi,
];

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Clean example values in an operation definition.
 * Removes sensitive data like auth tokens, emails, phone numbers.
 */
export function cleanExamples(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    let cleaned = obj;

    // Remove auth tokens
    for (const pattern of SENSITIVE_PATTERNS) {
      // Reset lastIndex for global patterns
      pattern.lastIndex = 0;
      cleaned = cleaned.replace(pattern, "REDACTED");
    }

    // Replace real emails with example
    cleaned = cleaned.replace(EMAIL_PATTERN, "user@example.com");

    // Replace cookie headers
    if (/^Cookie:/i.test(cleaned)) {
      return "";
    }

    // Clean masked values like "••••••"
    if (/^[•*]+$/.test(cleaned.trim())) {
      return "REDACTED";
    }

    return cleaned;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanExamples(item));
  }

  if (typeof obj === "object") {
    const result: AnyObj = {};
    for (const [key, value] of Object.entries(obj as AnyObj)) {
      // Skip x-readme code samples (contain raw curl commands with creds)
      if (key === "x-readme") {
        result[key] = cleanReadmeBlock(value);
        continue;
      }

      // Clean example values specifically
      if (key === "example" || key === "examples") {
        result[key] = cleanExamples(value);
        continue;
      }

      result[key] = cleanExamples(value);
    }
    return result;
  }

  return obj;
}

/**
 * Clean x-readme blocks - these contain curl samples with hardcoded credentials.
 */
function cleanReadmeBlock(block: unknown): unknown {
  if (!block || typeof block !== "object") return block;
  const obj = block as AnyObj;

  if (obj["code-samples"] && Array.isArray(obj["code-samples"])) {
    obj["code-samples"] = obj["code-samples"].map(
      (sample: AnyObj) => {
        if (sample.code && typeof sample.code === "string") {
          let code = sample.code;
          // Clean authorization headers in curl commands
          code = code.replace(
            /--header\s+'Authorization:\s*[^']*'/g,
            "--header 'Authorization: Basic XXXXXX'"
          );
          code = code.replace(
            /--header\s+"Authorization:\s*[^"]*"/g,
            '--header "Authorization: Basic XXXXXX"'
          );
          // Clean cookies
          code = code.replace(
            /--header\s+'Cookie:\s*[^']*'/g,
            ""
          );
          code = code.replace(
            /--header\s+"Cookie:\s*[^"]*"/g,
            ""
          );
          // Clean emails
          code = code.replace(EMAIL_PATTERN, "user@example.com");
          sample.code = code;
        }
        return sample;
      }
    );
  }

  return obj;
}

/**
 * Normalize a path key: remove trailing spaces, query params embedded in path,
 * and fix common issues.
 */
export function normalizePath(path: string): string {
  let normalized = path.trim();

  // Remove query parameters embedded in path keys
  const qIdx = normalized.indexOf("?");
  if (qIdx > 0) {
    normalized = normalized.substring(0, qIdx);
  }

  // Remove trailing hash
  if (normalized.endsWith("#")) {
    normalized = normalized.slice(0, -1);
  }

  // Remove " (COPY)" suffix
  normalized = normalized.replace(/\s*\(COPY\)\s*$/i, "");

  // Remove trailing whitespace in path
  normalized = normalized.replace(/\s+$/, "");

  // Ensure path starts with /
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }

  // Fix double slashes (but not in protocol)
  normalized = normalized.replace(/(?<!:)\/\//g, "/");

  return normalized;
}

/**
 * Clean an operation definition: remove empty/null fields,
 * ensure required fields exist.
 */
export function cleanOperation(
  operation: AnyObj,
  path: string,
  method: string
): AnyObj {
  const cleaned: AnyObj = {};

  // Ensure summary exists
  cleaned.summary = operation.summary || generateSummary(path, method);

  // Copy description if present and meaningful
  if (
    operation.description &&
    operation.description !== `Endpoint for ${method.toUpperCase()} ${path}`
  ) {
    cleaned.description = operation.description;
  }

  // Copy operationId if present, or generate one
  cleaned.operationId =
    operation.operationId || generateOperationId(path, method);

  // Copy parameters (filter out empty ones)
  if (operation.parameters && Array.isArray(operation.parameters)) {
    const params = operation.parameters.filter(
      (p: AnyObj) => p && p.name && p.in
    );
    if (params.length > 0) {
      cleaned.parameters = params.map((p: AnyObj) => cleanExamples(p));
    }
  }

  // Copy requestBody
  if (operation.requestBody) {
    cleaned.requestBody = cleanExamples(operation.requestBody);
  }

  // Copy responses
  if (operation.responses) {
    cleaned.responses = cleanExamples(operation.responses);
  } else {
    // Provide default responses
    cleaned.responses = {
      "200": { description: "Successful operation" },
      "400": { description: "Bad Request" },
      "401": { description: "Unauthorized" },
      "500": { description: "Internal Server Error" },
    };
  }

  // Copy security if present
  if (operation.security) {
    cleaned.security = operation.security;
  }

  // Copy tags
  if (operation.tags && Array.isArray(operation.tags)) {
    cleaned.tags = operation.tags;
  }

  return cleaned;
}

function generateSummary(path: string, method: string): string {
  const methodVerb =
    {
      get: "Get",
      post: "Create",
      put: "Update",
      delete: "Delete",
      patch: "Patch",
    }[method] || method.toUpperCase();

  // Extract meaningful segment from path
  const segments = path.split("/").filter(Boolean);
  const lastMeaningful = segments
    .filter((s) => !s.startsWith("{"))
    .pop();

  if (lastMeaningful) {
    return `${methodVerb} ${lastMeaningful}`;
  }

  return `${methodVerb} ${path}`;
}

function generateOperationId(path: string, method: string): string {
  const segments = path
    .split("/")
    .filter(Boolean)
    .map((s) => s.replace(/[{}]/g, ""))
    .map((s) => s.replace(/[^a-zA-Z0-9]/g, "_"));

  return `${method}_${segments.join("_")}`;
}
