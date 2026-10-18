import fs from "fs";
import path from "path";

import { NexoError } from "../../errors";

import type {
  DetectedProject,
  InitOptions,
  InitPackageJson,
} from "./types";
import type { ProjectLanguage, ProjectRuntime } from "../create/prompts";

export function get_project_paths(): {
  target_dir: string;
  package_path: string;
} {
  const target_dir = process.cwd();
  const package_path = path.join(target_dir, "package.json");

  if (!fs.existsSync(package_path)) {
    throw new NexoError(
      "O projeto existente precisa conter um package.json.",
      "PACKAGE_JSON_NOT_FOUND",
    );
  }

  return { target_dir, package_path };
}

export function read_package_json(package_path: string): InitPackageJson {
  return JSON.parse(fs.readFileSync(package_path, "utf8")) as InitPackageJson;
}

export function detect_project(
  target_dir: string,
  package_json: InitPackageJson,
): DetectedProject {
  const runtime: ProjectRuntime =
    fs.existsSync(path.join(target_dir, "bun.lockb")) ||
    fs.existsSync(path.join(target_dir, "bun.lock")) ||
    (typeof package_json.packageManager === "string" &&
      package_json.packageManager.startsWith("bun@"))
      ? "bun"
      : "node";

  const language: ProjectLanguage =
    fs.existsSync(path.join(target_dir, "tsconfig.json")) ||
    fs.existsSync(path.join(target_dir, "src/index.ts")) ||
    package_json.devDependencies?.typescript !== undefined
      ? "typescript"
      : "javascript";

  const has_nexo_configuration =
    package_json.nexocord !== undefined ||
    package_json.dependencies?.nexocord !== undefined ||
    package_json.devDependencies?.nexocord !== undefined ||
    Object.values(package_json.scripts ?? {}).some((script) =>
      script.includes("nexo"),
    );

  return { runtime, language, has_nexo_configuration };
}

export function resolve_init_choices(
  options: InitOptions,
): {
  runtime?: ProjectRuntime;
  language?: ProjectLanguage;
} {
  if (
    options.runtime !== undefined &&
    options.runtime !== "node" &&
    options.runtime !== "bun"
  ) {
    throw new NexoError(
      `Runtime inválido: "${options.runtime}". Use "node" ou "bun".`,
      "INVALID_RUNTIME",
    );
  }

  const requested_language =
    options.language === "ts"
      ? "typescript"
      : options.language === "js"
        ? "javascript"
        : options.language;

  if (
    requested_language !== undefined &&
    requested_language !== "typescript" &&
    requested_language !== "javascript"
  ) {
    throw new NexoError(
      `Linguagem inválida: "${options.language}". Use "ts" ou "js".`,
      "INVALID_LANGUAGE",
    );
  }

  return {
    runtime:
      options.runtime === "node" || options.runtime === "bun"
        ? options.runtime
        : undefined,
    language:
      requested_language === "typescript" || requested_language === "javascript"
        ? requested_language
        : undefined,
  };
}

export function configure_package_json(
  package_json: InitPackageJson,
  language: ProjectLanguage,
  runtime: ProjectRuntime,
  expected_type: string,
  update_type: boolean,
): void {
  package_json.dependencies ??= {};
  package_json.scripts ??= {};

  package_json.dependencies.nexocord ??= "latest";
  package_json.dependencies["discord.js"] ??= "^14.25.1";

  if (language === "typescript") {
    package_json.devDependencies ??= {};
    package_json.devDependencies.typescript ??= "^6.0.2";

    if (runtime === "bun") {
      package_json.devDependencies["@types/bun"] ??= "latest";
    } else {
      package_json.devDependencies.tsx ??= "^4.20.0";
      package_json.devDependencies["@types/node"] ??= "^24.0.0";
    }
  }

  if (update_type) {
    package_json.type = expected_type;
  }

  package_json.scripts.build ??= "nexo build";
  package_json.scripts.start ??=
    language === "typescript"
      ? "nexo start dist/index.js"
      : "nexo start src/index.js";
  package_json.scripts.dev ??=
    language === "typescript"
      ? "nexo dev src/index.ts"
      : "nexo dev src/index.js";
}

export function write_package_json(
  package_path: string,
  package_json: InitPackageJson,
): void {
  fs.writeFileSync(
    package_path,
    `${JSON.stringify(package_json, null, 2)}\n`,
    "utf8",
  );
}
