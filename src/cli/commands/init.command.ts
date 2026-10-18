import type { Command } from "commander";

import { run_init_flow } from "../services/init/flow";

export function register_command(program: Command): void {
  program
    .command("init")
    .description("Adiciona o Nexocord a um projeto existente")
    .option("--language <language>", "Linguagem: ts ou js")
    .option("--runtime <runtime>", "Runtime do projeto: node ou bun")
    .action(async (options: { runtime?: string; language?: string }) => {
      await run_init_flow(options);
    });
}
