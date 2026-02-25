import { Command } from "commander";
import { scaffold } from "@ioa/templates";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import pc from "picocolors";

export const initCommand = new Command("init")
  .description("Initialize an .ioa/ directory with scaffold templates")
  .option("--name <name>", "Project name")
  .option("--org <org>", "Organization name")
  .option("--domain <domain>", "Organization domain", "example.com")
  .action((options) => {
    const projectName = options.name || basename(process.cwd());
    const orgName = options.org || projectName;
    const orgDomain = options.domain;

    console.log(pc.bold(pc.cyan("\n🏗  IOA Init\n")));
    console.log(`  Project:      ${pc.white(projectName)}`);
    console.log(`  Organization: ${pc.white(orgName)}`);
    console.log(`  Domain:       ${pc.white(orgDomain)}`);
    console.log();

    const files = scaffold({
      projectName,
      orgName,
      orgDomain,
      doctrineVersion: "0.2",
    });

    const ioaDir = join(process.cwd(), ".ioa");

    for (const file of files) {
      const fullPath = join(ioaDir, file.path);
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, file.content, "utf-8");
      console.log(`  ${pc.green("✓")} ${pc.dim(".ioa/")}${file.path}`);
    }

    console.log(pc.bold(pc.green(`\n✅ Initialized IOA project with ${files.length} files.\n`)));
    console.log(`  Next steps:`);
    console.log(`    ${pc.cyan("ioa validate")}  — Validate your configuration`);
    console.log(`    ${pc.cyan("ioa status")}    — View compliance dashboard`);
    console.log();
  });
