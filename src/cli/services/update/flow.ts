import { NexoError } from "../../errors";
import { log } from "../../logger";
import { get_package_manager, has_package_json, run_command } from "../../utils";

export async function run_update(): Promise<void> {
  if (!has_package_json()) {
    throw new NexoError("package.json não encontrado.", "PACKAGE_JSON_NOT_FOUND");
  }

  const manager = get_package_manager();
  const args =
    manager === "yarn"
      ? ["upgrade", "nexocord"]
      : ["update", "nexocord"];

  log.info(`Atualizando NexoCord usando ${manager}...`);
  const code = await run_command(manager, args);
  if (code !== 0) {
    throw new NexoError("Falha ao atualizar o NexoCord.", "UPDATE_FAILED", code);
  }
  log.success("NexoCord atualizado com sucesso.");
}
