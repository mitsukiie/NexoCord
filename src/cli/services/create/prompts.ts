
import { isCancel, select, text } from "@clack/prompts";
import chalk from "chalk";

import { NexoError } from "../../errors";

import type {
  ProjectChoices,
  ProjectLanguage,
  ProjectRuntime,
} from "../project/types";

export type {
  ProjectChoices,
  ProjectLanguage,
  ProjectRuntime,
} from "../project/types";

function abort_on_cancel<T>(value: T): T {
  if (isCancel(value)) {
    throw new Error("Operação cancelada.");
  }

  return value;
}

export async function ask_project_name(
  initial_name?: string,
): Promise<string> {
  const normalized_name = initial_name?.trim();

  if (normalized_name) {
    return normalized_name;
  }

  const value = abort_on_cancel(
    await text({
      message: chalk.cyan("Nome do bot"),
      placeholder: chalk.gray("my-bot"),
      validate(value) {
        if (!value?.trim()) {
          return chalk.red("Informe um nome para o projeto.");
        }
      },
    }),
  );

  return String(value).trim();
}

export async function ask_runtime(
  initial_value: ProjectRuntime = "node",
): Promise<ProjectRuntime> {
  return abort_on_cancel(
    await select<ProjectRuntime>({
      message: chalk.cyan("Runtime"),
      initialValue: initial_value,
      options: [
        { value: "node", label: chalk.blue("Node.js") },
        { value: "bun", label: chalk.magenta("Bun") },
      ],
    }),
  ) as ProjectRuntime;
}

export async function ask_language(
  initial_value: ProjectLanguage = "typescript",
): Promise<ProjectLanguage> {
  return abort_on_cancel(
    await select<ProjectLanguage>({
      message: chalk.cyan("Linguagem"),
      initialValue: initial_value,
      options: [
        { value: "typescript", label: chalk.blue("TypeScript") },
        { value: "javascript", label: chalk.yellow("JavaScript") },
      ],
    }),
  ) as ProjectLanguage;
}

export async function ask_create_choices(
  initial_name?: string,
  initial_runtime?: ProjectRuntime,
  initial_language?: ProjectLanguage,
): Promise<ProjectChoices> {
  const name = await ask_project_name(initial_name);
  const runtime = initial_runtime ?? (await ask_runtime());
  const language = initial_language ?? (await ask_language());

  return { name, runtime, language };
}

export function resolve_create_choices(options: {
  runtime?: string;
  language?: string;
}): {
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

  const language =
    options.language === "ts"
      ? "typescript"
      : options.language === "js"
        ? "javascript"
        : options.language;

  if (
    language !== undefined &&
    language !== "typescript" &&
    language !== "javascript"
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
      language === "typescript" || language === "javascript"
        ? language
        : undefined,
  };
}