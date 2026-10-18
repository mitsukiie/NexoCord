import type { Command } from "commander";

import { run_dev } from "../services/dev/flow";

export function register_command(program: Command): void {
  program
    .command("dev [file]")
    .description("Inicia o bot em modo desenvolvimento")
    .option("-w, --watch", "Reinicia automaticamente ao salvar")
    .action(
      async (file: string | undefined, options: { watch?: boolean }) => {
        await run_dev(file, options);
      },
    );
}
