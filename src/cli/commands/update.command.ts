import type { Command } from "commander";

import { run_update } from "../services/update/flow";

export function register_command(program: Command): void {
  program
    .command("update")
    .description("Atualiza o NexoCord do projeto")
    .action(async () => {
      await run_update();
    });
}
