import type { Command } from "commander";

import { run_build } from "../services/build/flow";

export function register_command(program: Command): void {
  program
    .command("build")
    .description("Prepara o projeto para execução em produção")
    .action(async () => {
      await run_build();
    });
}
