import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import type { CreateAnswers, ProjectLanguage, ProjectRuntime } from "./prompts";

export interface GenerateResult {
  projectName: string;
  targetDir: string;
  runtime: ProjectRuntime;
  language: ProjectLanguage;
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));

async function resolveTemplatesRoot(): Promise<string> {
  const candidates = [
    path.join(currentDir, "templates"),
    path.join(currentDir, "..", "create", "templates"),
    path.join(currentDir, "..", "templates"),
    path.join(currentDir, "..", "..", "templates"),
    path.join(currentDir, "..", "..", "src", "create", "templates"),
  ];

  for (const dir of candidates) {
    try {
      await fs.access(dir);
      return dir;
    } catch {
      continue;
    }
  }

  throw new Error("Templates do create não encontrados no pacote.");
}

function getTemplateName(runtime: ProjectRuntime, language: ProjectLanguage): string {
  const lang = language === "typescript" ? "ts" : "js";
  return `${runtime}-${lang}`;
}

function getScriptExt(language: ProjectLanguage): "ts" | "js" {
  return language === "typescript" ? "ts" : "js";
}

async function copyTemplateDirectory(
  sourceDir: string,
  targetDir: string,
  extension: "ts" | "js",
  projectName: string,
  frameworkPackageName: string
): Promise<void> {
  await fs.mkdir(targetDir, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDir, entry.name);
      const normalizedName = entry.name.endsWith(".tpl")
        ? `${entry.name.slice(0, -4)}.${extension}`
        : entry.name;
      const targetPath = path.join(targetDir, normalizedName);

      if (entry.isDirectory()) {
        await copyTemplateDirectory(
          sourcePath,
          targetPath,
          extension,
          projectName,
          frameworkPackageName
        );
        return;
      }

      const raw = await fs.readFile(sourcePath, "utf8");
      const content = raw
        .replaceAll("__EXT__", extension)
        .replaceAll("__PROJECT_NAME__", projectName)
        .replaceAll("__NEXO_PACKAGE__", frameworkPackageName);
      await fs.writeFile(targetPath, content, "utf8");
    })
  );
}

async function ensureEmptyTarget(targetDir: string) {
  try {
    const entries = await fs.readdir(targetDir);
    if (entries.length > 0) {
      throw new Error("A pasta de destino já existe e não está vazia.");
    }
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}

export async function prepareProjectTarget(projectName: string): Promise<string> {
  const normalized = projectName.trim();
  if (!normalized) {
    throw new Error("Informe um nome para o projeto.");
  }

  const targetDir = path.resolve(process.cwd(), normalized);
  await ensureEmptyTarget(targetDir);
  return targetDir;
}

function createPackageJson(options: CreateAnswers, frameworkPackageName: string) {
  const isTypeScript = options.language === "typescript";
  const isBun = options.runtime === "bun";
  const sourceEntry = `src/index.${isTypeScript ? "ts" : "js"}`;

  const scripts: Record<string, string> = {
    dev: `nexo dev ${sourceEntry} --runtime ${options.runtime}`,
    start: "nexo start dist/index.js",
  };

  if (isTypeScript) {
    scripts.prestart = "npm run build";
    scripts.build = isBun ? "bunx tsc -p tsconfig.json" : "tsc -p tsconfig.json";
  } else {
    scripts.start = `nexo start ${sourceEntry}`;
  }

  return {
    name: options.name,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts,
    dependencies: {
      "discord.js": "^14.25.1",
      [frameworkPackageName]: "latest",
    },
    devDependencies: isTypeScript
      ? {
          typescript: "^6.0.2",
          ...(isBun
            ? { "@types/bun": "latest" }
            : { "@types/node": "^25.5.0", tsx: "^4.20.6" }),
        }
      : undefined,
    engines: isBun ? undefined : { node: ">=20" },
  };
}

async function resolveFrameworkPackageName(): Promise<string> {
  return "nexocord";
}

function createTsConfig(): Record<string, unknown> {
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
      types: ["node"],
    },
    include: ["src"],
  };
}

export async function generateProject(
  options: CreateAnswers,
  preparedTargetDir?: string
): Promise<GenerateResult> {
  const projectName = options.name.trim();
  const targetDir = preparedTargetDir ?? (await prepareProjectTarget(projectName));

  const templateName = getTemplateName(options.runtime, options.language);
  const templatesRoot = await resolveTemplatesRoot();
  const templateDir = path.join(templatesRoot, templateName);

  await fs.access(templateDir);

  const extension = getScriptExt(options.language);
  const frameworkPackageName = await resolveFrameworkPackageName();
  await copyTemplateDirectory(
    templateDir,
    targetDir,
    extension,
    projectName,
    frameworkPackageName
  );

  const packageJson = createPackageJson(options, frameworkPackageName);
  await fs.writeFile(
    path.join(targetDir, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8"
  );

  if (options.language === "typescript") {
    const tsconfig = createTsConfig();
    await fs.writeFile(
      path.join(targetDir, "tsconfig.json"),
      `${JSON.stringify(tsconfig, null, 2)}\n`,
      "utf8"
    );
  }

  return {
    projectName,
    targetDir,
    runtime: options.runtime,
    language: options.language,
  };
}
