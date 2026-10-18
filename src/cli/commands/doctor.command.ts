import type { Command } from "commander";

import { run_doctor } from "../services/doctor/flow";

export function register_command(program: Command): void {
  program
    .command("doctor")
    .description("Verifica o ambiente do projeto")
    .action(() => {
      run_doctor();
    });
}
