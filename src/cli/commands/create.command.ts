import type { Command } from "commander";

import {
  run_create_flow,
  type CreateOptions,
} from "../services/create/flow";

export function register_command(program: Command): void {
  program
    .command("create [name]")
    .description("Cria um novo projeto NexoCord")
    .option("--language <language>", "Linguagem: ts ou js")
    .option("--runtime <runtime>", "Runtime do projeto: node ou bun")
    .action(async (name: string | undefined, options: CreateOptions) => {
      await run_create_flow(name, options);
    });
}
