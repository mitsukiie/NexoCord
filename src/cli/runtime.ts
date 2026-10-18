import { spawnSync } from "child_process";

export type RuntimeMode = "auto" | "bun" | "node";

export function has_runtime(command: string): boolean {
  const result = spawnSync(command, ["--version"], {
    stdio: "ignore",
    shell: process.platform === "win32",
  });

  return !result.error && result.status === 0;
}

export function get_runtime_version(command: string): string | null {
  const result = spawnSync(command, ["--version"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.error || result.status !== 0) {
    return null;
  }

  return result.stdout.trim();
}

export function validate_runtime(value: string): RuntimeMode {
  const runtime = value.toLowerCase();

  if (runtime !== "auto" && runtime !== "bun" && runtime !== "node") {
    throw new Error(
      `Runtime inválido: "${value}". Use "auto", "node" ou "bun".`,
    );
  }

  return runtime;
}
