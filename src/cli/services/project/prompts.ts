
import { isCancel, select } from "@clack/prompts";
import chalk from "chalk";

import type { ProjectLanguage, ProjectRuntime } from "./types";

function abort_on_cancel<T>(value: T): T {
  if (isCancel(value)) {
    throw new Error("Operação cancelada.");
  }

  return value;
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
