import os from "os";

import { log } from "../../logger";
import {
  get_file_extension,
  get_package_manager,
  has_package_json,
  read_package_json,
  resolve_entry,
} from "../../utils";
import { get_runtime_version } from "../../runtime";

export function run_info(version?: string): void {
  log.title("Informações do NexoCord");
  console.log(`NexoCord: ${version}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`npm: ${get_runtime_version("npm") ?? "não encontrado"}`);
  console.log(`Bun: ${get_runtime_version("bun") ?? "não encontrado"}`);
  console.log(`SO: ${os.platform()}`);
  console.log(`Arquitetura: ${os.arch()}`);
  console.log(`Diretório: ${process.cwd()}`);

  if (!has_package_json()) {
    log.warn("Nenhum package.json encontrado neste diretório.");
    return;
  }

  const package_json = read_package_json();
  console.log(`Projeto: ${String(package_json.name ?? "desconhecido")}`);
  console.log(`Package manager: ${get_package_manager()}`);

  try {
    const entry = resolve_entry();
    console.log(`Entry: ${entry}`);
    console.log(`Linguagem: ${get_file_extension(entry)}`);
  } catch {
    log.warn("Arquivo de entrada não encontrado.");
  }
}
