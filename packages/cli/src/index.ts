import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { validateCommand } from "./commands/validate.js";
import { statusCommand } from "./commands/status.js";
import { migrateCommand } from "./commands/migrate.js";
import { generateCommand } from "./commands/generate.js";

export const program = new Command()
  .name("ioa")
  .description("IOA — Applied Organizational Intelligence CLI")
  .version("0.2.0");

program.addCommand(initCommand);
program.addCommand(validateCommand);
program.addCommand(statusCommand);
program.addCommand(migrateCommand);
program.addCommand(generateCommand);
