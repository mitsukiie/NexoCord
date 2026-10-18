import { NexoError } from "../../errors";
import { log } from "../../logger";
import {
  get_env_file,
  get_file_extension,
  get_package_manager,
  resolve_start_entry,
  run_command,
} from "../../utils";

export async function run_start(file: string | undefined): Promise<void> {
  const entry = resolve_start_entry(file);

  if (get_file_extension(entry) === "ts") {
    throw new NexoError(
      `O entrypoint de produção "${entry}" ainda é TypeScript. Execute "nexo build" e informe o arquivo JavaScript gerado ao usar "nexo start".`,
      "UNCOMPILED_ENTRY",
    );
  }

  log.start();
  log.info("📦 Modo produção");
  const env_file = get_env_file();
  const args = env_file ? ["--env-file", env_file, entry] : [entry];
  if (env_file) log.env();

  const command = get_package_manager() === "bun" ? "bun" : process.execPath;
  const code = await run_command(command, args);
  if (code !== 0) {
    throw new NexoError(
      `O processo terminou com código ${code}.`,
      "START_FAILED",
      code,
    );
  }
}
