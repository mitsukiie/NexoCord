import { has_runtime } from "../../runtime";
import { NexoError } from "../../errors";
import { run_command } from "../../utils";

import type { ProjectRuntime } from "./prompts";

export async function install_dependencies(
  target_dir: string,
  runtime: ProjectRuntime,
): Promise<void> {
  const command = runtime === "bun" ? "bun" : "npm";

  if (!has_runtime(command)) {
    throw new NexoError(
      `${command} não foi encontrado no PATH.`,
      "RUNTIME_NOT_FOUND",
    );
  }

  const code = await run_command(command, ["install"], {
    cwd: target_dir,
    stdio: "inherit",
  });

  if (code !== 0) {
    throw new NexoError(
      `Falha ao instalar dependências. O comando "${command} install" terminou com código ${code}.`,
      "INSTALL_FAILED",
    );
  }
}
