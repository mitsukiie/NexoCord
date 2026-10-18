import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type {
  CreateAnswers,
  ProjectLanguage,
  ProjectRuntime,
} from "./prompts";

export interface GenerateProjectOptions {
  create_package_json?: boolean;
  overwrite_files?: boolean;
}

export interface GenerateResult {
  target_dir: string;
  project_name: string;
  runtime: ProjectRuntime;
  language: ProjectLanguage;
}

function get_template_name(
  runtime: ProjectRuntime,
  language: ProjectLanguage
): string {
  const runtime_name = runtime === "bun" ? "bun" : "node";
  const language_name = language === "typescript" ? "ts" : "js";

  return `${runtime_name}-${language_name}`;
}

function find_template_root(): string {
  const current_dir = path.dirname(fileURLToPath(import.meta.url));

  const candidates = [
    path.resolve(current_dir, "templates"),
    path.resolve(process.cwd(), "src/cli/services/create/templates"),
    path.resolve(process.cwd(), "dist/cli/services/create/templates"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("Diretório de templates do NexoCord não encontrado.");
}

function is_text_template(file: string): boolean {
  const extension = path.extname(file).toLowerCase();

  return [".tpl", ".md", ".json", ".txt"].includes(extension);
}

function replace_template_values(
  content: string,
  options: CreateAnswers,
  extension: string
): string {
  return content
    .replaceAll("__EXT__", extension)
    .replaceAll("__PROJECT_NAME__", options.name)
    .replaceAll("__NEXO_PACKAGE__", "nexocord");
}

function get_output_file_name(
  file_name: string,
  extension: string
): string {
  if (file_name.endsWith(".tpl")) {
    return `${file_name.slice(0, -4)}.${extension}`;
  }

  return file_name.replaceAll("__EXT__", extension);
}

function copy_template_directory(
  source_dir: string,
  target_dir: string,
  options: CreateAnswers,
  overwrite_files: boolean
): void {
  fs.mkdirSync(target_dir, { recursive: true });

  const extension =
    options.language === "typescript"
      ? "ts"
      : "js";

  const entries = fs.readdirSync(source_dir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const source_path = path.join(source_dir, entry.name);

    const output_name = get_output_file_name(
      entry.name,
      extension
    );

    const target_path = path.join(
      target_dir,
      output_name
    );

    if (entry.isDirectory()) {
      copy_template_directory(
        source_path,
        target_path,
        options,
        overwrite_files
      );

      continue;
    }

    if (!overwrite_files && fs.existsSync(target_path)) {
      continue;
    }

    if (is_text_template(source_path)) {
      const content = fs.readFileSync(
        source_path,
        "utf8"
      );

      const replaced_content =
        replace_template_values(
          content,
          options,
          extension
        );

      fs.writeFileSync(
        target_path,
        replaced_content,
        "utf8"
      );

      continue;
    }

    fs.copyFileSync(
      source_path,
      target_path
    );
  }
}

function create_package_json(
  options: CreateAnswers
): Record<string, unknown> {
  const extension =
    options.language === "typescript"
      ? "ts"
      : "js";

  const package_json: Record<string, unknown> = {
    name: options.name,
    version: "1.0.0",
    private: true,
    type: options.language === "typescript" ? "module" : "commonjs",

    scripts: {
      dev: `nexo dev src/index.${extension}`,
      build: "nexo build",
      start: `nexo start ${options.language === "typescript" ? "dist/index.js" : `src/index.${extension}`}`,
    },

    dependencies: {
      nexocord: "latest",
      "discord.js": "^14.25.1",
    },
  };

  if (options.language === "typescript") {
    package_json.scripts = {
      dev: "nexo dev src/index.ts",
      build: "nexo build",
      start: "nexo start dist/index.js",
    };

    package_json.devDependencies = {
      typescript: "^6.0.2",

      ...(options.runtime === "bun"
        ? {
            "@types/bun": "latest",
          }
        : {
            "@types/node": "^24.0.0",
            tsx: "^4.20.0",
          }),
    };

    if (options.runtime === "node") {
      package_json.engines = {
        node: ">=20",
      };
    }
  }

  return package_json;
}

function create_ts_config(
  _options: CreateAnswers
): Record<string, unknown> {
  return {
    compilerOptions: {
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "Bundler",
      strict: true,
      skipLibCheck: true,
      outDir: "dist",
      rootDir: "src",
      resolveJsonModule: true,
      forceConsistentCasingInFileNames: true,
      types: _options.runtime === "bun" ? ["bun"] : ["node"],
    },

    include: [
      "src",
    ],
  };
}

function write_json_file(
  file_path: string,
  data: Record<string, unknown>
): void {
  fs.writeFileSync(
    file_path,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8"
  );
}

export async function prepare_project_target(
  project_name: string
): Promise<string> {
  const target_dir =
    project_name === "."
      ? process.cwd()
      : path.resolve(process.cwd(), project_name);

  if (project_name !== ".") {
    if (fs.existsSync(target_dir)) {
      const entries = fs.readdirSync(target_dir);

      if (entries.length > 0) {
        throw new Error(
          `O diretório "${project_name}" já existe e não está vazio.`
        );
      }
    } else {
      fs.mkdirSync(target_dir, {
        recursive: true,
      });
    }
  }

  return target_dir;
}

export async function generate_project(
  options: CreateAnswers,
  target_dir: string,
  generate_options: GenerateProjectOptions = {}
): Promise<GenerateResult> {
  const template_name = get_template_name(
    options.runtime,
    options.language
  );

  const template_root =
    find_template_root();

  const template_dir =
    path.join(
      template_root,
      template_name
    );

  if (!fs.existsSync(template_dir)) {
    throw new Error(
      `Template "${template_name}" não encontrado.`
    );
  }

  copy_template_directory(
    template_dir,
    target_dir,
    options,
    generate_options.overwrite_files !== false
  );

  const should_create_package_json =
    generate_options.create_package_json !== false;

  const package_json_path =
    path.join(
      target_dir,
      "package.json"
    );

  if (
    should_create_package_json &&
    !fs.existsSync(package_json_path)
  ) {
    write_json_file(
      package_json_path,
      create_package_json(options)
    );
  }

  if (
    options.language === "typescript"
  ) {
    const tsconfig_path =
      path.join(
        target_dir,
        "tsconfig.json"
      );

    if (!fs.existsSync(tsconfig_path)) {
      write_json_file(
        tsconfig_path,
        create_ts_config(options)
      );
    }
  }

  return {
    target_dir,
    project_name: options.name,
    runtime: options.runtime,
    language: options.language,
  };
}