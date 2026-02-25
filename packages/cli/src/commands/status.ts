import { Command } from "commander";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import pc from "picocolors";

function countFiles(dir: string, ext: string = ".yaml"): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith(ext) || f.endsWith(".yml")).length;
}

function loadNames(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => {
      const content = readFileSync(join(dir, f), "utf-8");
      const data = parseYaml(content);
      return data?.metadata?.name || f.replace(/\.ya?ml$/, "");
    });
}

export const statusCommand = new Command("status")
  .description("Display IOA project status dashboard")
  .option("--path <path>", "Path to .ioa/ directory", ".ioa")
  .action((options) => {
    const ioaPath = join(process.cwd(), options.path);

    if (!existsSync(ioaPath)) {
      console.error(pc.red(`\n✗ No .ioa/ directory found.`));
      console.error(`  Run ${pc.cyan("ioa init")} first.\n`);
      process.exit(1);
    }

    // Load config
    const configPath = join(ioaPath, "config.json");
    let config: any = {};
    if (existsSync(configPath)) {
      config = JSON.parse(readFileSync(configPath, "utf-8"));
    }

    const domains = loadNames(join(ioaPath, "domains"));
    const agents = loadNames(join(ioaPath, "agents"));
    const decisions = loadNames(join(ioaPath, "decisions"));
    const telemetry = loadNames(join(ioaPath, "telemetry"));
    const governance = loadNames(join(ioaPath, "governance"));
    const workflows = loadNames(join(ioaPath, "workflows"));

    const line = "─".repeat(50);

    console.log(pc.bold(pc.cyan("\n┌" + line + "┐")));
    console.log(pc.bold(pc.cyan("│")) + pc.bold("  IOA Status Dashboard".padEnd(50)) + pc.bold(pc.cyan("│")));
    console.log(pc.bold(pc.cyan("├" + line + "┤")));

    console.log(pc.cyan("│") + `  Project:   ${pc.white(config.name || "unknown")}`.padEnd(50) + pc.cyan("│"));
    console.log(pc.cyan("│") + `  Org:       ${pc.white(config.organization?.name || "unknown")}`.padEnd(50) + pc.cyan("│"));
    console.log(pc.cyan("│") + `  Doctrine:  ${pc.white("v" + (config.version || "0.1"))}`.padEnd(50) + pc.cyan("│"));

    console.log(pc.cyan("├" + line + "┤"));
    console.log(pc.cyan("│") + pc.bold("  Resources".padEnd(50)) + pc.cyan("│"));
    console.log(pc.cyan("├" + line + "┤"));

    const printResource = (icon: string, label: string, names: string[]) => {
      const count = pc.bold(String(names.length));
      console.log(pc.cyan("│") + `  ${icon} ${label.padEnd(15)} ${count}`.padEnd(50) + pc.cyan("│"));
      for (const name of names) {
        console.log(pc.cyan("│") + `    ${pc.dim("└")} ${pc.dim(name)}`.padEnd(50) + pc.cyan("│"));
      }
    };

    printResource("📦", "Domains", domains);
    printResource("🤖", "Agents", agents);
    printResource("📋", "Decisions", decisions);
    printResource("📊", "Telemetry", telemetry);
    printResource("🛡️ ", "Governance", governance);
    printResource("⚡", "Workflows", workflows);

    console.log(pc.bold(pc.cyan("└" + line + "┘")));

    const total = domains.length + agents.length + decisions.length + telemetry.length + governance.length + workflows.length;
    console.log(pc.dim(`\n  ${total} total resources defined.\n`));
    console.log(`  Run ${pc.cyan("ioa validate")} to check compliance.\n`);
  });
