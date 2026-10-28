
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  create_package_json,
  create_ts_config,
  write_json_file,
} from "./package-json";

import type {
  ProjectChoices,
  GenerateProjectOptions,
  GenerateResult,
} from "./types";

function find_template_root(): string {
  const current_dir = path.dirname(fileURLToPath(import.meta.url));

  const candidates = [
    path.resolve(current_dir, "templates"),
    path.resolve(current_dir, "../cli/services/project/templates"),
    path.resolve(process.cwd(), "src/cli/services/project/templates"),
    path.resolve(process.cwd(), "dist/cli/services/project/templates"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "js")) &&
        fs.existsSync(path.join(candidate, "ts"))) {
      return candidate;
    }
  }

  throw new Error("Diretório de templates do NexoCord não encontrado.");
}

function get_template_name(
  language: ProjectChoices["language"],
): string {
  return language === "typescript" ? "ts" : "js";
}

function replace_template_values(
  content: string,
  options: ProjectChoices,
  extension: string,
): string {
  return content
    .replaceAll("__EXT__", extension)
    .replaceAll("__PROJECT_NAME__", options.name)
    .replaceAll("__NEXO_PACKAGE__", "nexocord");
}

function get_output_file_name(
  file_name: string,
  extension: string,
): string {
  return file_name.endsWith(".tpl")
    ? `${file_name.slice(0, -4)}.${extension}`
    : file_name.replaceAll("__EXT__", extension);
}

function is_text_template(file: string): boolean {
  return [".tpl", ".md", ".json", ".txt"].includes(
    path.extname(file).toLowerCase(),
  );
}

function copy_template_directory(
  source_dir: string,
  target_dir: string,
  options: ProjectChoices,
  overwrite_files: boolean,
): void {
  fs.mkdirSync(target_dir, { recursive: true });

  const extension =
    options.language === "typescript" ? "ts" : "js";

  for (const entry of fs.readdirSync(source_dir, {
    withFileTypes: true,
  })) {
    const source_path = path.join(source_dir, entry.name);
    const output_name = get_output_file_name(entry.name, extension);
    const target_path = path.join(target_dir, output_name);

    if (entry.isDirectory()) {
      copy_template_directory(
        source_path,
        target_path,
        options,
        overwrite_files,
      );
      continue;
    }

    if (!overwrite_files && fs.existsSync(target_path)) {
      continue;
    }

    if (is_text_template(source_path)) {
      const content = fs.readFileSync(source_path, "utf8");

      fs.writeFileSync(
        target_path,
        replace_template_values(content, options, extension),
        "utf8",
      );
      continue;
    }

    fs.copyFileSync(source_path, target_path);
  }
}

export async function prepare_project_target(
  project_name: string,
): Promise<string> {
  const target_dir =
    project_name === "."
      ? process.cwd()
      : path.resolve(process.cwd(), project_name);

  if (project_name !== ".") {
    if (fs.existsSync(target_dir)) {
      if (fs.readdirSync(target_dir).length > 0) {
        throw new Error(
          `O diretório "${project_name}" já existe e não está vazio.`,
        );
      }
    } else {
      fs.mkdirSync(target_dir, { recursive: true });
    }
  }

  return target_dir;
}

export async function generate_project(
  options: ProjectChoices,
  target_dir: string,
  generate_options: GenerateProjectOptions = {},
): Promise<GenerateResult> {
  const template_root = find_template_root();
  const template_dir = path.join(
    template_root,
    get_template_name(options.language),
  );

  if (!fs.existsSync(template_dir)) {
    throw new Error(
      `Template "${get_template_name(options.language)}" não encontrado.`,
    );
  }

  copy_template_directory(
    template_dir,
    target_dir,
    options,
    generate_options.overwrite_files !== false,
  );

  const package_json_path = path.join(target_dir, "package.json");

  if (
    generate_options.create_package_json !== false &&
    !fs.existsSync(package_json_path)
  ) {
    write_json_file(package_json_path, create_package_json(options));
  }

  if (options.language === "typescript") {
    const tsconfig_path = path.join(target_dir, "tsconfig.json");

    if (!fs.existsSync(tsconfig_path)) {
      write_json_file(tsconfig_path, create_ts_config(options));
    }
  }

  return {
    target_dir,
    project_name: options.name,
    runtime: options.runtime,
    language: options.language,
  };
}
