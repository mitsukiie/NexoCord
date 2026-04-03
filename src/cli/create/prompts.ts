import { cancel, isCancel, select, text } from "@clack/prompts";

import type { CreateAnswers, ProjectLanguage, ProjectRuntime } from "../../create/prompts";

function abortOnCancel<T>(value: T): T {
  if (isCancel(value)) {
    cancel("Operação cancelada.");
    process.exit(0);
  }

  return value;
}

export async function askProjectName(initialName?: string): Promise<string> {
  const normalizedInitial = initialName?.trim();
  if (normalizedInitial) return normalizedInitial;

  const name = abortOnCancel(
    await text({
      message: "Nome do bot",
      placeholder: "my-bot",
      validate(value) {
        if (!value.trim()) return "Informe um nome para o projeto.";
        return undefined;
      },
    })
  ) as string;

  return name.trim();
}

export async function askRuntime(): Promise<ProjectRuntime> {
  return abortOnCancel(
    await select<ProjectRuntime>({
      message: "Runtime",
      initialValue: "node",
      options: [
        { value: "node", label: "Node.js" },
        { value: "bun", label: "Bun" },
      ],
    })
  ) as ProjectRuntime;
}

export async function askLanguage(): Promise<ProjectLanguage> {
  return abortOnCancel(
    await select<ProjectLanguage>({
      message: "Linguagem",
      initialValue: "typescript",
      options: [
        { value: "typescript", label: "TypeScript" },
        { value: "javascript", label: "JavaScript" },
      ],
    })
  ) as ProjectLanguage;
}

export async function askCreateChoices(initialName?: string): Promise<CreateAnswers> {
  const name = await askProjectName(initialName);
  const runtime = await askRuntime();
  const language = await askLanguage();

  return { name, runtime, language };
}
