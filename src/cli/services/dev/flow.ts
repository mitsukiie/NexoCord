import fs from "fs";
import path from "path";

import { NexoError } from "../../errors";
import { log } from "../../logger";
import { has_runtime } from "../../runtime";
import {
  get_env_file,
  get_file_extension,
  get_package_manager,
  resolve_entry,
  run_command,
} from "../../utils";

export interface DevOptions {
  watch?: boolean;
}

export async function run_dev(
  file: string | undefined,
  options: DevOptions,
): Promise<void> {
  const entry = resolve_entry(file);
  const env = get_env_file();
  const watch = Boolean(options.watch);
  const extension = get_file_extension(entry);
  const using_bun = get_package_manager() === "bun";

  log.start();
  log.runtime(using_bun ? "Bun" : "Node.js");
  if (env) log.env();
  if (watch) log.watch();

  if (using_bun) {
    if (!has_runtime("bun")) {
      throw new NexoError("Bun não encontrado no PATH.", "BUN_NOT_FOUND");
    }

    const args = watch ? ["--watch"] : [];
    if (env) args.push(`--env-file=${env}`);
    args.push(entry);
    process.exitCode = await run_command("bun", args);
    return;
  }

  if (extension === "ts") {
    const local_tsx = path.resolve(
      process.cwd(),
      "node_modules",
      ".bin",
      process.platform === "win32" ? "tsx.cmd" : "tsx",
    );
    const has_tsx = has_runtime("tsx");
    const has_npx = has_runtime("npx");

    if (!fs.existsSync(local_tsx) && !has_tsx && !has_npx) {
      throw new NexoError(
        "O tsx não foi encontrado. Execute nexo init --language ts --runtime node para instalar o executor automaticamente.",
        "TSX_NOT_FOUND",
      );
    }

    const command = fs.existsSync(local_tsx) ? local_tsx : has_tsx ? "tsx" : "npx";
    const args = command === "npx" ? ["--no-install", "tsx"] : [];
    if (watch) args.push("watch");
    if (env) args.push(`--env-file=${env}`);
    args.push(entry);
    process.exitCode = await run_command(command, args);
    return;
  }

  if (watch) {
    log.warn("Watch não é suportado nativamente para JavaScript com o runtime detectado.");
  }

  const args = env ? [`--env-file=${env}`, entry] : [entry];
  process.exitCode = await run_command(process.execPath, args);
}
