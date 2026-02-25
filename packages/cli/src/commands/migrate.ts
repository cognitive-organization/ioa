import { Command } from "commander";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import pc from "picocolors";

function migrateResource(data: any): { migrated: boolean; resource: any } {
  if (!data || data.apiVersion === "ioa.dev/v0.2") {
    return { migrated: false, resource: data };
  }

  if (data.apiVersion !== "ioa.dev/v0.1") {
    return { migrated: false, resource: data };
  }

  const result = JSON.parse(JSON.stringify(data)); // deep clone
  result.apiVersion = "ioa.dev/v0.2";

  // Migrate metadata.owner from string to structured
  if (typeof result.metadata?.owner === "string") {
    result.metadata.owner = {
      name: result.metadata.owner,
      role: "owner",
    };
  }

  // Kind-specific migrations
  switch (result.kind) {
    case "Domain":
      // Migrate KPI targets from string to structured
      if (result.spec?.kpis) {
        for (const kpi of result.spec.kpis) {
          if (typeof kpi.target === "string") {
            // Try to parse common patterns like ">4.5", "<2 weeks", "10000"
            const match = kpi.target.match(/^([<>]=?|=)?\s*([\d.]+)\s*(.*)$/);
            if (match) {
              const [, op, val, unit] = match;
              const operatorMap: Record<string, string> = {
                ">": "gt", ">=": "gte", "<": "lt", "<=": "lte", "=": "eq", "": "gte",
              };
              kpi.target = {
                operator: operatorMap[op || ""] || "gte",
                value: parseFloat(val),
                unit: (unit || kpi.unit || "").trim(),
              };
              if (kpi.unit) delete kpi.unit;
            }
            // If can't parse, leave as string (backward compat)
          }
        }
      }
      // Migrate dataOwnership from string[] to structured
      if (result.spec?.dataOwnership && typeof result.spec.dataOwnership[0] === "string") {
        result.spec.dataOwnership = result.spec.dataOwnership.map((d: string) => ({
          name: d,
          classification: "internal",
        }));
      }
      break;

    case "Agent":
      // Add default role based on type
      if (!result.spec?.role) {
        const typeToRole: Record<string, string> = {
          autonomous: "tactical",
          supervised: "tactical",
          advisory: "analytical",
          reactive: "observer",
        };
        result.spec.role = typeToRole[result.spec?.type] || "tactical";
      }
      // Migrate capabilities from string[] to structured
      if (result.spec?.capabilities && typeof result.spec.capabilities[0] === "string") {
        result.spec.capabilities = result.spec.capabilities.map((c: string) => ({
          name: c.toLowerCase().replace(/\s+/g, "-").substring(0, 40),
          type: "analysis",
          description: c,
        }));
      }
      // Add default memory scope
      if (result.spec?.memory && !result.spec.memory.scope) {
        result.spec.memory.scope = "domain";
      }
      break;

    case "Decision":
      // Fix status enum: "accepted" -> keep, add "active" option
      // Add empty assumptions if missing
      if (!result.spec?.assumptions) {
        result.spec.assumptions = [];
      }
      // Migrate deciders from string[] to structured
      if (result.spec?.deciders && typeof result.spec.deciders[0] === "string") {
        result.spec.deciders = result.spec.deciders.map((d: string) => ({
          name: d,
          role: "decider",
        }));
      }
      // Add initiatedBy if missing
      if (!result.spec?.initiatedBy) {
        result.spec.initiatedBy = { type: "human", name: "unknown" };
      }
      break;

    case "Telemetry":
      // Add severity if missing
      if (!result.spec?.severity) {
        result.spec.severity = "info";
      }
      // Add correlationId if missing
      if (!result.spec?.correlationId) {
        result.spec.correlationId = { required: false, format: "uuid" };
      }
      // Migrate alertThreshold to structured alertRule
      if (result.spec?.observability?.alertThreshold && !result.spec.observability.alertRule) {
        // Keep alertThreshold for compat, just add correlationId
      }
      break;

    case "Governance":
      // Add empty compliance if missing
      if (!result.spec?.compliance) {
        result.spec.compliance = { standards: [], requirements: [] };
      }
      break;
  }

  return { migrated: true, resource: result };
}

function migrateYamlFiles(dir: string): { file: string; migrated: boolean }[] {
  const results: { file: string; migrated: boolean }[] = [];
  if (!existsSync(dir)) return results;

  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".yaml") && !f.endsWith(".yml")) continue;
    const fullPath = join(dir, f);
    const content = readFileSync(fullPath, "utf-8");
    const data = parseYaml(content);
    const { migrated, resource } = migrateResource(data);

    if (migrated) {
      writeFileSync(fullPath, stringifyYaml(resource, { lineWidth: 0 }), "utf-8");
    }
    results.push({ file: f, migrated });
  }
  return results;
}

export const migrateCommand = new Command("migrate")
  .description("Migrate .ioa/ resources from v0.1 to v0.2 format")
  .option("--path <path>", "Path to .ioa/ directory", ".ioa")
  .option("--dry-run", "Show what would be migrated without writing")
  .action((options) => {
    const ioaPath = join(process.cwd(), options.path);

    if (!existsSync(ioaPath)) {
      console.error(pc.red(`\n✗ Directory not found: ${ioaPath}`));
      console.error(`  Run ${pc.cyan("ioa init")} first.\n`);
      process.exit(1);
    }

    console.log(pc.bold(pc.cyan("\n🔄 IOA Migrate (v0.1 → v0.2)\n")));

    if (options.dryRun) {
      console.log(pc.yellow("  [dry-run] No files will be modified.\n"));
    }

    // Migrate config.json
    const configPath = join(ioaPath, "config.json");
    let configMigrated = false;
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      if (config.version === "0.1") {
        config.version = "0.2";
        if (!config.paths?.workflows) {
          config.paths = config.paths || {};
          config.paths.workflows = "workflows";
        }
        if (!options.dryRun) {
          writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
        }
        configMigrated = true;
      }
    }

    if (configMigrated) {
      console.log(`  ${pc.green("✓")} ${pc.dim("config.json")} → v0.2`);
    } else {
      console.log(`  ${pc.dim("–")} ${pc.dim("config.json")} already v0.2`);
    }

    // Migrate resource directories
    const dirs = ["domains", "agents", "decisions", "telemetry", "governance"];
    let totalMigrated = configMigrated ? 1 : 0;
    let totalSkipped = configMigrated ? 0 : 1;

    for (const dir of dirs) {
      const dirPath = join(ioaPath, dir);
      if (!existsSync(dirPath)) continue;

      if (options.dryRun) {
        // In dry-run, just report what would happen
        for (const f of readdirSync(dirPath)) {
          if (!f.endsWith(".yaml") && !f.endsWith(".yml")) continue;
          const content = readFileSync(join(dirPath, f), "utf-8");
          const data = parseYaml(content);
          if (data?.apiVersion === "ioa.dev/v0.1") {
            console.log(`  ${pc.yellow("→")} ${pc.dim(dir + "/")}${f} would migrate`);
            totalMigrated++;
          } else {
            console.log(`  ${pc.dim("–")} ${pc.dim(dir + "/")}${f} already v0.2`);
            totalSkipped++;
          }
        }
      } else {
        const results = migrateYamlFiles(dirPath);
        for (const r of results) {
          if (r.migrated) {
            console.log(`  ${pc.green("✓")} ${pc.dim(dir + "/")}${r.file} → v0.2`);
            totalMigrated++;
          } else {
            console.log(`  ${pc.dim("–")} ${pc.dim(dir + "/")}${r.file} already v0.2`);
            totalSkipped++;
          }
        }
      }
    }

    console.log();
    if (totalMigrated > 0) {
      console.log(pc.bold(pc.green(`✅ Migrated ${totalMigrated} resource(s) to v0.2.`)));
    } else {
      console.log(pc.dim("  No resources needed migration."));
    }
    if (totalSkipped > 0) {
      console.log(pc.dim(`  ${totalSkipped} resource(s) already at v0.2.`));
    }
    console.log();
    console.log(`  Run ${pc.cyan("ioa validate")} to verify the migration.\n`);
  });
