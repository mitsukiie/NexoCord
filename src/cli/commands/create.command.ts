import type { Command } from "commander";

import { run_create_flow } from "../services/create/flow";

export function register_command(program: Command): void {
  program
    .command("create [name]")
    .description("Cria um novo projeto NexoCord")
    .action(async (name?: string) => {
      await run_create_flow(name);
    });
}
