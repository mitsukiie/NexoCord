import { spawn } from "child_process";
import fs from "fs";
import path from "path";

import { NexoError } from "./errors";

function find_existing_entry(entries: string[]): string | null {
  for (const entry of entries) {
    if (fs.existsSync(path.resolve(process.cwd(), entry))) {
      return entry;
    }
  }

  return null;
}

function get_compiled_entry(source_entry: string): string | null {
  const tsconfig_path = path.resolve(process.cwd(), "tsconfig.json");

  if (!fs.existsSync(tsconfig_path)) {
    return null;
  }

  let tsconfig: { compilerOptions?: { outDir?: string; rootDir?: string } };

  try {
    tsconfig = JSON.parse(
      fs.readFileSync(tsconfig_path, "utf8"),
    ) as typeof tsconfig;
  } catch {
    throw new NexoError(
      "Não foi possível ler o tsconfig.json.",
      "INVALID_TSCONFIG",
    );
  }

  const out_dir = tsconfig.compilerOptions?.outDir ?? "dist";
  const root_dir = tsconfig.compilerOptions?.rootDir ?? "src";
  const relative_entry = path.relative(root_dir, source_entry);
  const compiled_entry = path.join(
    out_dir,
    relative_entry.replace(/\.[^.]+$/, ".js"),
  );

  return fs.existsSync(path.resolve(process.cwd(), compiled_entry))
    ? compiled_entry
    : null;
}

export function resolve_entry(file?: string): string {
  if (file?.trim()) {
    const entry = file.trim();

    if (!fs.existsSync(path.resolve(process.cwd(), entry))) {
      throw new NexoError(
        `Arquivo de entrada não encontrado: ${entry}`,
        "ENTRY_NOT_FOUND",
      );
    }

    return entry;
  }

  const entry = find_existing_entry([
    "src/index.ts",
    "src/bot.ts",
    "src/index.js",
    "src/bot.js",
    "index.ts",
    "bot.ts",
    "index.js",
    "bot.js",
  ]);

  if (entry) {
    return entry;
  }

  throw new NexoError(
    "Não foi possível encontrar o arquivo de entrada do projeto.",
    "ENTRY_NOT_FOUND",
  );
}

export function resolve_start_entry(file?: string): string {
  if (file?.trim()) {
    return resolve_entry(file);
  }

  const package_json = read_package_json();
  const package_entry =
    typeof package_json.main === "string" ? package_json.main : undefined;

  if (
    package_entry &&
    fs.existsSync(path.resolve(process.cwd(), package_entry))
  ) {
    return package_entry;
  }

  const source_entry = find_existing_entry([
    "src/index.ts",
    "src/bot.ts",
    "index.ts",
    "bot.ts",
  ]);

  if (source_entry) {
    const compiled_entry = get_compiled_entry(source_entry);

    if (compiled_entry) {
      return compiled_entry;
    }
  }

  const entry = find_existing_entry([
    "dist/index.js",
    "dist/bot.js",
    "src/index.js",
    "src/bot.js",
    "index.js",
    "bot.js",
  ]);

  if (entry) {
    return entry;
  }

  throw new NexoError(
    "Não foi possível encontrar o entrypoint de produção. Informe o arquivo ao usar nexo start ou adicione o campo main ao package.json.",
    "START_ENTRY_NOT_FOUND",
  );
}

export function get_env_file(): string | null {
  const env_file = path.resolve(process.cwd(), ".env");

  if (!fs.existsSync(env_file)) {
    return null;
  }

  return env_file;
}

export function get_project_root(): string {
  return process.cwd();
}

export function get_package_json_path(): string {
  return path.join(process.cwd(), "package.json");
}

export function has_package_json(): boolean {
  return fs.existsSync(get_package_json_path());
}

export function read_package_json(): Record<string, unknown> {
  const package_path = get_package_json_path();

  if (!fs.existsSync(package_path)) {
    throw new NexoError(
      "package.json não encontrado.",
      "PACKAGE_JSON_NOT_FOUND",
    );
  }

  try {
    const content = fs.readFileSync(package_path, "utf8");
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    throw new NexoError(
      "Não foi possível ler o package.json.",
      "INVALID_PACKAGE_JSON",
    );
  }
}

export function get_package_manager(): "npm" | "bun" | "pnpm" | "yarn" {
  if (fs.existsSync(path.join(process.cwd(), "bun.lockb"))) {
    return "bun";
  }

  if (fs.existsSync(path.join(process.cwd(), "bun.lock"))) {
    return "bun";
  }

  if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) {
    return "yarn";
  }

  return "npm";
}

export function run_command(
  command: string,
  args: string[] = [],
  options: {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    stdio?: "inherit" | "pipe" | "ignore";
  } = {},
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
      stdio: options.stdio ?? "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", reject);

    child.on("close", (code) => {
      resolve(code ?? 1);
    });
  });
}

export function path_exists(target: string): boolean {
  return fs.existsSync(path.resolve(process.cwd(), target));
}

export function is_directory_empty(directory: string): boolean {
  if (!fs.existsSync(directory)) {
    return true;
  }

  return fs.readdirSync(directory).length === 0;
}

export function is_valid_package_name(name: string): boolean {
  if (!name) {
    return false;
  }

  if (name.length > 214) {
    return false;
  }

  if (name.startsWith(".") || name.startsWith("_")) {
    return false;
  }

  if (/[A-Z]/.test(name)) {
    return false;
  }

  if (/[^a-z0-9._~-]/.test(name)) {
    return false;
  }

  return true;
}

export function get_file_extension(file: string): string {
  return path.extname(file).replace(".", "").toLowerCase();
}
