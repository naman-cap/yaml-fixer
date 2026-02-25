/**
 * Builder: constructs clean OpenAPI spec objects for each subsection.
 */
import { SUBSECTIONS } from "./config";
import { cleanOperation, normalizePath } from "./fixer";
import type { ClassifiedEndpoint } from "./classifier";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;

export interface BuiltSpec {
  subsectionId: string;
  filename: string;
  spec: AnyObj;
  endpointCount: number;
}

/**
 * Build an OpenAPI spec for a single subsection from its classified endpoints.
 */
export function buildSubsectionSpec(
  subsectionId: string,
  endpoints: ClassifiedEndpoint[]
): BuiltSpec {
  const def = SUBSECTIONS[subsectionId];
  if (!def) {
    throw new Error(`Unknown subsection: ${subsectionId}`);
  }

  // Build paths object
  const paths: AnyObj = {};

  for (const ep of endpoints) {
    const normalizedPath = normalizePath(ep.path);

    // Skip placeholder/example paths
    if (
      normalizedPath.includes("check_API_Endpoint_Example") ||
      normalizedPath === "/"
    ) {
      continue;
    }

    if (!paths[normalizedPath]) {
      paths[normalizedPath] = {};
    }

    // Clean and add the operation
    paths[normalizedPath][ep.method] = cleanOperation(
      ep.operation,
      normalizedPath,
      ep.method
    );
  }

  // Count actual endpoints (path + method combos)
  let endpointCount = 0;
  for (const pathItem of Object.values(paths)) {
    for (const key of Object.keys(pathItem as AnyObj)) {
      if (
        [
          "get",
          "post",
          "put",
          "delete",
          "patch",
          "head",
          "options",
          "trace",
        ].includes(key)
      ) {
        endpointCount++;
      }
    }
  }

  // Build the spec
  const spec: AnyObj = {
    openapi: "3.0.1",
    info: {
      title: def.title,
      description: def.description,
      version: "1.0.0",
    },
    servers: [
      {
        url: `https://{host}${def.serverBase}`,
        variables: {
          host: {
            default: "eu.api.capillarytech.com",
            description: "API host",
          },
        },
      },
    ],
    paths,
    components: {
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
        oauthToken: {
          type: "apiKey",
          in: "header",
          name: "X-CAP-API-OAUTH-TOKEN",
        },
      },
    },
    security: [{ basicAuth: [] }],
  };

  return {
    subsectionId,
    filename: `${subsectionId}.yaml`,
    spec,
    endpointCount,
  };
}

/**
 * Build all subsection specs from classified endpoints.
 */
export function buildAllSpecs(
  grouped: Record<string, ClassifiedEndpoint[]>
): BuiltSpec[] {
  const results: BuiltSpec[] = [];

  for (const [subsectionId, endpoints] of Object.entries(grouped)) {
    if (endpoints.length === 0) continue;

    try {
      const built = buildSubsectionSpec(subsectionId, endpoints);
      if (built.endpointCount > 0) {
        results.push(built);
      }
    } catch (e) {
      console.warn(`Failed to build spec for ${subsectionId}:`, e);
    }
  }

  // Sort by subsection ID for consistent output
  results.sort((a, b) => a.subsectionId.localeCompare(b.subsectionId));

  return results;
}
