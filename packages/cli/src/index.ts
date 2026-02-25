import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { validateCommand } from "./commands/validate.js";
import { statusCommand } from "./commands/status.js";

export const program = new Command()
  .name("ioa")
  .description("IOA — Applied Organizational Intelligence CLI")
  .version("0.1.0");

program.addCommand(initCommand);
program.addCommand(validateCommand);
program.addCommand(statusCommand);
