import { Command } from "commander";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import pc from "picocolors";
import { stringify } from "yaml";

// Resource templates — minimal valid resources
const templates: Record<string, (name: string, options: Record<string, string>) => object> = {
  domain: (name, _opts) => ({
    apiVersion: "ioa.dev/v0.2",
    kind: "Domain",
    metadata: {
      name,
      owner: { name: "TODO", role: "domain-lead" },
    },
    spec: {
      purpose: "TODO: Describe the purpose of this domain",
      kpis: [
        {
          name: "TODO-kpi",
          target: { operator: "gte", value: 0, unit: "TODO" },
        },
      ],
      events: {
        produces: [],
        consumes: [],
      },
    },
  }),

  agent: (name, opts) => ({
    apiVersion: "ioa.dev/v0.2",
    kind: "Agent",
    metadata: {
      name,
      owner: { name: "TODO", role: "agent-owner" },
    },
    spec: {
      domain: opts.domain || "TODO",
      type: "advisory",
      role: "analytical",
      purpose: "TODO: Describe what this agent does",
      capabilities: [
        { name: "TODO-capability", type: "analysis", description: "TODO" },
      ],
      governance: {
        escalatesTo: "TODO",
        requiresApproval: false,
        auditLevel: "summary",
      },
      tokenBudget: {
        maxDaily: 100000,
        maxMonthly: 2000000,
        alertAt: 0.8,
      },
    },
  }),

  workflow: (name, opts) => ({
    apiVersion: "ioa.dev/v0.2",
    kind: "Workflow",
    metadata: {
      name,
      owner: { name: "TODO", role: "workflow-owner" },
    },
    spec: {
      description: "TODO: Describe this workflow",
      domainsInvolved: [opts.domain || "TODO"],
      trigger: {
        event: "TODO.event_name",
      },
      steps: [
        {
          name: "step-1",
          agent: "TODO-agent",
          action: "TODO: Describe step action",
          timeout: "5m",
          onFailure: "abort",
        },
      ],
      timeout: "30m",
      failurePolicy: "abort",
    },
  }),

  decision: (name, opts) => ({
    apiVersion: "ioa.dev/v0.2",
    kind: "Decision",
    metadata: {
      name,
      owner: { name: "TODO", role: "decision-maker" },
    },
    spec: {
      id: name.replace(/^dec-/, "DEC-").replace(/-/g, "-").toUpperCase().replace(/^(.{3})/, "DEC-"),
      status: "proposed",
      domain: opts.domain || "TODO",
      date: new Date().toISOString().split("T")[0],
      context: "TODO: Describe the context and problem",
      options: [
        { name: "Option A", description: "TODO", pros: ["TODO"], cons: ["TODO"] },
        { name: "Option B", description: "TODO", pros: ["TODO"], cons: ["TODO"] },
      ],
      reversibility: "moderate",
    },
  }),

  "security-policy": (name, opts) => ({
    apiVersion: "ioa.dev/v0.2",
    kind: "SecurityPolicy",
    metadata: {
      name,
      owner: { name: "TODO", role: "security-lead" },
    },
    spec: {
      domain: opts.domain || "TODO",
      agentIdentity: { required: true, method: "token" },
      dataScopes: [],
      zeroTrust: { enabled: false },
      auditTrail: { immutable: true, retention: "365d" },
      promptInjectionDefense: { enabled: true, sanitizeInputs: true, onDetection: "block" },
      enforcementMode: "warn",
    },
  }),

  budget: (name, opts) => ({
    apiVersion: "ioa.dev/v0.2",
    kind: "Budget",
    metadata: {
      name,
      owner: { name: "TODO", role: "finance-lead" },
    },
    spec: {
      domain: opts.domain || "TODO",
      period: "monthly",
      limits: {
        tokens: { daily: 100000, monthly: 2000000 },
        cost: { daily: 5, monthly: 100, currency: "USD" },
      },
      alerts: [
        { threshold: 0.8, severity: "warning", channels: ["TODO"] },
        { threshold: 1.0, severity: "critical", channels: ["TODO"] },
      ],
      enforcement: "warn",
    },
  }),

  memory: (name, opts) => ({
    apiVersion: "ioa.dev/v0.2",
    kind: "Memory",
    metadata: {
      name,
      owner: { name: "TODO", role: "agent" },
    },
    spec: {
      scope: "domain",
      sourceDomain: opts.domain || "TODO",
      entryType: "observation",
      content: "TODO: Describe the memory content",
      tags: [],
      retention: { duration: "90d", archiveAfter: "60d" },
      indexing: { searchable: true },
    },
  }),
};

// Map resource type to output subdirectory
const outputDirs: Record<string, string> = {
  domain: "domains",
  agent: "agents",
  workflow: "workflows",
  decision: "decisions",
  "security-policy": "security",
  budget: "budgets",
  memory: "memory",
};

function generateResource(type: string, name: string, options: Record<string, string & boolean>) {
  const templateFn = templates[type];
  if (!templateFn) {
    console.error(pc.red(`Unknown resource type: ${type}`));
    console.error(`Valid types: ${Object.keys(templates).join(", ")}`);
    process.exit(1);
  }

  const resource = templateFn(name, options);
  const yamlContent = stringify(resource, { lineWidth: 0 });

  const basePath = options.path || ".ioa";
  const subDir = outputDirs[type] || type;
  const outDir = join(process.cwd(), basePath, subDir);
  const outFile = join(outDir, `${name}.yaml`);

  if (existsSync(outFile) && !options.force) {
    console.error(pc.red(`\nFile already exists: ${outFile}`));
    console.error(`Use ${pc.cyan("--force")} to overwrite.`);
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, yamlContent, "utf-8");

  console.log(pc.bold(pc.cyan(`\n✨ Generated ${type}\n`)));
  console.log(`  ${pc.green("✓")} ${pc.dim(basePath + "/" + subDir + "/")}${name}.yaml`);
  console.log();
  console.log(`  Next: edit the ${pc.yellow("TODO")} fields, then run ${pc.cyan("ioa validate")}`);
  console.log();
}

export const generateCommand = new Command("generate")
  .description("Generate an IOA resource YAML file from template")
  .argument("<type>", `Resource type: ${Object.keys(templates).join(", ")}`)
  .argument("<name>", "Resource name (kebab-case)")
  .option("--domain <domain>", "Domain to bind the resource to")
  .option("--path <path>", "Base output path (default: .ioa)")
  .option("--force", "Overwrite existing file", false)
  .action((type: string, name: string, options) => {
    generateResource(type, name, options);
  });
