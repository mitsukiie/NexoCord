import { cancel, isCancel, select, text } from "@clack/prompts";
import chalk from "chalk";

export type ProjectRuntime = "node" | "bun";

export type ProjectLanguage =
  | "typescript"
  | "javascript";

export interface CreateAnswers {
  name: string;
  runtime: ProjectRuntime;
  language: ProjectLanguage;
}

function abort_on_cancel<T>(value: T): T {
  if (isCancel(value)) {
    cancel(chalk.yellow("Operação cancelada."));
    throw new Error("Operação cancelada.");
  }

  return value;
}

export async function ask_project_name(initial_name?: string): Promise<string> {
  const normalized_name = initial_name?.trim();

  if (normalized_name) {
    return normalized_name;
  }

  const name = abort_on_cancel(
    await text({
      message: chalk.cyan("Nome do bot"),
      placeholder: chalk.gray("my-bot"),
      validate(value) {
        if (!value?.trim()) {
          return chalk.red("Informe um nome para o projeto.");
        }

        return undefined;
      },
    }),
  ) as string;

  return name.trim();
}

export async function ask_runtime(
  initialValue: ProjectRuntime = "node",
): Promise<ProjectRuntime> {
  return abort_on_cancel(
    await select<ProjectRuntime>({
      message: chalk.cyan("Runtime"),
      initialValue,
      options: [
        {
          value: "node",
          label: chalk.blue("Node.js"),
        },
        {
          value: "bun",
          label: chalk.magenta("Bun"),
        },
      ],
    }),
  ) as ProjectRuntime;
}

export async function ask_language(
  initialValue: ProjectLanguage = "typescript",
): Promise<ProjectLanguage> {
  return abort_on_cancel(
    await select<ProjectLanguage>({
      message: chalk.cyan("Linguagem"),
      initialValue,
      options: [
        {
          value: "typescript",
          label: chalk.blue("TypeScript"),
        },
        {
          value: "javascript",
          label: chalk.yellow("JavaScript"),
        },
      ],
    }),
  ) as ProjectLanguage;
}

export async function ask_create_choices(
  initial_name?: string,
): Promise<CreateAnswers> {
  const name = await ask_project_name(initial_name);
  const runtime = await ask_runtime();
  const language = await ask_language();

  return {
    name,
    runtime,
    language,
  };
}
