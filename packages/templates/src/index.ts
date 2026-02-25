import Handlebars from "handlebars";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ScaffoldContext {
  projectName: string;
  orgName: string;
  orgDomain: string;
  doctrineVersion: string;
}

function getScaffoldDir(): string {
  // In dist, scaffolds is at ../../scaffolds relative to dist/index.js
  return join(__dirname, "..", "scaffolds", "init");
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

export interface ScaffoldFile {
  /** Relative path inside .ioa/ (e.g. "config.json", "domains/_example-product.yaml") */
  path: string;
  content: string;
}

export function scaffold(context: ScaffoldContext): ScaffoldFile[] {
  const scaffoldDir = getScaffoldDir();
  const templateFiles = walkDir(scaffoldDir);
  const result: ScaffoldFile[] = [];

  for (const templatePath of templateFiles) {
    const relPath = relative(join(scaffoldDir, ".ioa"), templatePath)
      .replace(/\.hbs$/, "")
      .replace(/\\/g, "/");

    const raw = readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(raw);
    const content = template(context);

    result.push({ path: relPath, content });
  }

  return result;
}
