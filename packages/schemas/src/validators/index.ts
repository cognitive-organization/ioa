import Ajv, { type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { readFileSync } from "node:fs";

// Import schemas — resolved at build-time by the bundler
import domainSchema from "../domain.schema.json";
import agentSchema from "../agent.schema.json";
import decisionSchema from "../decision.schema.json";
import telemetrySchema from "../telemetry.schema.json";
import governanceSchema from "../governance.schema.json";
import workflowSchema from "../workflow.schema.json";
import configSchema from "../config.schema.json";

// ---------------------------------------------------------------------------
// Schema registry
// ---------------------------------------------------------------------------

const SCHEMAS: Record<string, object> = {
  Domain: domainSchema,
  Agent: agentSchema,
  Decision: decisionSchema,
  Telemetry: telemetrySchema,
  Governance: governanceSchema,
  Workflow: workflowSchema,
  Config: configSchema,
};

// ---------------------------------------------------------------------------
// AJV instance
// ---------------------------------------------------------------------------

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validators: Record<string, ValidateFunction> = {};

for (const [kind, schema] of Object.entries(SCHEMAS)) {
  validators[kind] = ajv.compile(schema);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a data object against an IOA schema by kind name.
 *
 * @param kind  - Resource kind: "Domain", "Agent", "Decision", "Telemetry", "Governance", or "Config"
 * @param data  - The data object to validate
 * @returns     - `{ valid, errors }` where errors is an array of human-readable messages
 */
export function validate(kind: string, data: unknown): ValidationResult {
  const validator = validators[kind];
  if (!validator) {
    return {
      valid: false,
      errors: [
        `Unknown kind "${kind}". Valid kinds: ${Object.keys(SCHEMAS).join(", ")}`,
      ],
    };
  }

  const valid = validator(data) as boolean;
  const errors: string[] = [];

  if (!valid && validator.errors) {
    for (const err of validator.errors) {
      const path = err.instancePath || "/";
      const msg = err.message ?? "unknown error";
      errors.push(`${path}: ${msg}`);
    }
  }

  return { valid, errors };
}

/**
 * Read a YAML or JSON file from disk and validate it.
 *
 * For YAML files (`.yml` / `.yaml`), this function dynamically imports the
 * `yaml` package. Make sure it is available in the consumer's dependency tree.
 *
 * The `kind` is inferred from the file content:
 *  - K8s-style resources: read from the top-level `kind` field
 *  - Config files: detected when `name` + `version` are present and `kind` is absent
 *
 * @param filePath - Absolute or relative path to the file
 * @returns        - `{ valid, errors }`
 */
export async function validateFile(filePath: string): Promise<ValidationResult> {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch (err) {
    return {
      valid: false,
      errors: [`Failed to read file: ${(err as Error).message}`],
    };
  }

  let data: unknown;

  if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
    try {
      // Dynamic import so the yaml dependency is optional at the schema level
      const yaml = await import("yaml");
      data = yaml.parse(raw);
    } catch (err) {
      return {
        valid: false,
        errors: [`Failed to parse YAML: ${(err as Error).message}`],
      };
    }
  } else {
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return {
        valid: false,
        errors: [`Failed to parse JSON: ${(err as Error).message}`],
      };
    }
  }

  // Infer kind
  const obj = data as Record<string, unknown>;
  let kind: string;

  if (typeof obj.kind === "string" && obj.kind in SCHEMAS) {
    kind = obj.kind;
  } else if (
    typeof obj.name === "string" &&
    typeof obj.version === "string" &&
    !("kind" in obj)
  ) {
    kind = "Config";
  } else {
    return {
      valid: false,
      errors: [
        `Cannot infer resource kind. Expected a "kind" field with one of: ${Object.keys(SCHEMAS).join(", ")}`,
      ],
    };
  }

  return validate(kind, data);
}

/**
 * Retrieve the raw JSON Schema object for a given kind.
 *
 * @param kind - Resource kind name
 * @returns    - The JSON Schema object, or `undefined` if the kind is unknown
 */
export function getSchema(kind: string): object | undefined {
  return SCHEMAS[kind];
}
