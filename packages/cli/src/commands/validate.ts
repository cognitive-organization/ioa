import { Command } from "commander";
import { validate } from "@ioa/schemas";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import pc from "picocolors";

interface ValidationResult {
  file: string;
  kind: string;
  valid: boolean;
  errors: string[];
}

function loadYamlFiles(dir: string): Array<{ path: string; data: any }> {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => {
      const fullPath = join(dir, f);
      const content = readFileSync(fullPath, "utf-8");
      return { path: fullPath, data: parseYaml(content) };
    });
}

export const validateCommand = new Command("validate")
  .description("Validate .ioa/ resources against IOA schemas")
  .option("--path <path>", "Path to .ioa/ directory", ".ioa")
  .action((options) => {
    const ioaPath = join(process.cwd(), options.path);

    if (!existsSync(ioaPath)) {
      console.error(pc.red(`\n✗ Directory not found: ${ioaPath}`));
      console.error(`  Run ${pc.cyan("ioa init")} first.\n`);
      process.exit(1);
    }

    console.log(pc.bold(pc.cyan("\n🔍 IOA Validate\n")));

    const results: ValidationResult[] = [];
    const resources: Map<string, Set<string>> = new Map();

    // Validate config
    const configPath = join(ioaPath, "config.json");
    if (existsSync(configPath)) {
      const configData = JSON.parse(readFileSync(configPath, "utf-8"));
      const result = validate("Config", configData);
      results.push({ file: "config.json", kind: "Config", ...result });
    }

    // Map of directory -> kind
    const kindMap: Record<string, string> = {
      domains: "Domain",
      agents: "Agent",
      decisions: "Decision",
      telemetry: "Telemetry",
      governance: "Governance",
      workflows: "Workflow",
      memory: "Memory",
    };

    // Load and validate all resources
    for (const [dir, kind] of Object.entries(kindMap)) {
      const files = loadYamlFiles(join(ioaPath, dir));
      const names = new Set<string>();
      for (const { path, data } of files) {
        const result = validate(kind, data);
        const fileName = `${dir}/${path.split(/[\\/]/).pop()}`;
        results.push({ file: fileName, kind, ...result });
        if (data?.metadata?.name) {
          names.add(data.metadata.name);
        }
      }
      resources.set(kind, names);
    }

    // Cross-reference validation
    const crossRefErrors: string[] = [];
    const domainNames = resources.get("Domain") || new Set();

    // Check agents reference valid domains
    const agentFiles = loadYamlFiles(join(ioaPath, "agents"));
    for (const { path, data } of agentFiles) {
      if (data?.spec?.domain && !domainNames.has(data.spec.domain)) {
        crossRefErrors.push(
          `Agent "${data.metadata?.name}" references unknown domain "${data.spec.domain}"`
        );
      }
    }

    // Check decisions reference valid domains
    const decisionFiles = loadYamlFiles(join(ioaPath, "decisions"));
    for (const { path, data } of decisionFiles) {
      if (data?.spec?.domain && !domainNames.has(data.spec.domain)) {
        crossRefErrors.push(
          `Decision "${data.metadata?.name}" references unknown domain "${data.spec.domain}"`
        );
      }
    }

    // Check telemetry references valid domains/agents
    const agentNames = resources.get("Agent") || new Set();
    const telemetryFiles = loadYamlFiles(join(ioaPath, "telemetry"));
    for (const { path, data } of telemetryFiles) {
      if (data?.spec?.source?.domain && !domainNames.has(data.spec.source.domain)) {
        crossRefErrors.push(
          `Telemetry "${data.metadata?.name}" references unknown domain "${data.spec.source.domain}"`
        );
      }
      if (data?.spec?.source?.agent && !agentNames.has(data.spec.source.agent)) {
        crossRefErrors.push(
          `Telemetry "${data.metadata?.name}" references unknown agent "${data.spec.source.agent}"`
        );
      }
    }

    // Check workflow references valid agents and domains
    const workflowFiles = loadYamlFiles(join(ioaPath, "workflows"));
    for (const { path, data } of workflowFiles) {
      // Check steps reference valid agents
      if (data?.spec?.steps) {
        for (const step of data.spec.steps) {
          if (step.agent && !agentNames.has(step.agent)) {
            crossRefErrors.push(
              `Workflow "${data.metadata?.name}" step "${step.name || step.id}" references unknown agent "${step.agent}"`
            );
          }
        }
      }
      // Check domainsInvolved reference valid domains
      if (data?.spec?.domainsInvolved) {
        for (const domain of data.spec.domainsInvolved) {
          if (!domainNames.has(domain)) {
            crossRefErrors.push(
              `Workflow "${data.metadata?.name}" references unknown domain "${domain}" in domainsInvolved`
            );
          }
        }
      }
    }

    // Print results
    let passed = 0;
    let failed = 0;

    for (const r of results) {
      if (r.valid) {
        console.log(`  ${pc.green("✓")} ${pc.dim(r.kind.padEnd(12))} ${r.file}`);
        passed++;
      } else {
        console.log(`  ${pc.red("✗")} ${pc.dim(r.kind.padEnd(12))} ${r.file}`);
        for (const err of r.errors) {
          console.log(`    ${pc.red("→")} ${err}`);
        }
        failed++;
      }
    }

    // Print cross-reference errors
    if (crossRefErrors.length > 0) {
      console.log(pc.bold(pc.yellow("\n⚠ Cross-reference issues:\n")));
      for (const err of crossRefErrors) {
        console.log(`  ${pc.yellow("→")} ${err}`);
        failed++;
      }
    }

    const total = passed + failed;
    console.log();
    if (failed === 0) {
      console.log(pc.bold(pc.green(`✅ All ${total} resources valid. 100% compliant.\n`)));
    } else {
      console.log(
        pc.bold(pc.red(`❌ ${failed} issue(s) found out of ${total} checks.\n`))
      );
      process.exit(1);
    }
  });
