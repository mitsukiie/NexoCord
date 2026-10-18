import type { Command } from "commander";

import { run_info } from "../services/info/flow";

export function register_command(program: Command): void {
  program
    .command("info")
    .description("Exibe informações do ambiente e do projeto")
    .action(() => {
      run_info(program.version());
    });
}
