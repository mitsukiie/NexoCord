import fs from "fs";
import path from "path";

import { log } from "../../logger";
import { get_runtime_version, has_runtime } from "../../runtime";
import { get_package_manager, has_package_json, resolve_entry } from "../../utils";

export function run_doctor(): void {
  log.title("🩺 Diagnóstico do NexoCord");
  let errors = 0;

  if (has_runtime("node")) log.success(`Node.js ${get_runtime_version("node")}`);
  else {
    log.error("Node.js não encontrado.");
    errors++;
  }
  if (has_runtime("npm")) log.success(`npm ${get_runtime_version("npm")}`);
  else log.warn("npm não encontrado.");
  if (has_runtime("bun")) log.success(`Bun ${get_runtime_version("bun")}`);
  else log.info("Bun não instalado.");

  if (!has_package_json()) log.warn("package.json não encontrado.");
  else {
    log.success("package.json encontrado.");
    log.info(`Package manager: ${get_package_manager()}`);
  }

  try {
    const entry = resolve_entry();
    if (fs.existsSync(path.resolve(process.cwd(), entry))) {
      log.success(`Entry encontrado: ${entry}`);
    }
  } catch {
    log.error("Nenhum arquivo de entrada encontrado.");
    errors++;
  }

  const env_file = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(env_file)) log.success(".env encontrado.");
  else log.info(".env não encontrado.");
  if (fs.existsSync(path.resolve(process.cwd(), "tsconfig.json"))) {
    log.success("tsconfig.json encontrado.");
  }

  console.log("");
  if (errors === 0) log.success("Nenhum problema crítico encontrado.");
  else {
    log.error(`${errors} problema(s) crítico(s) encontrado(s).`);
    process.exitCode = 1;
  }
}
