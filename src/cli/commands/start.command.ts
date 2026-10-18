import type { Command } from "commander";

import { run_start } from "../services/start/flow";

export function register_command(program: Command): void {
  program
    .command("start [file]")
    .description("Inicia o projeto em modo produção")
    .action(async (file: string | undefined) => {
      await run_start(file);
    });
}
