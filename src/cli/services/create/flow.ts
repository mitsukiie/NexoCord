
import { cancel, intro, outro, spinner } from "@clack/prompts";
import chalk from "chalk";

import { setup_project } from "../project/setup";
import { prepare_project_target } from "../project/generator";
import {
  ask_create_choices,
  resolve_create_choices,
} from "./prompts";

export interface CreateOptions {
  runtime?: string;
  language?: string;
}

function stop_on_sigint(): () => void {
  const on_sigint = () => {
    cancel(chalk.yellow("Operação cancelada."));
    process.exitCode = 130;
  };

  process.once("SIGINT", on_sigint);

  return () => process.off("SIGINT", on_sigint);
}

export async function run_create_flow(
  initial_name?: string,
  options: CreateOptions = {},
): Promise<void> {
  intro(chalk.cyan("🚀 NexoCord"));

  const unbind_sigint = stop_on_sigint();

  try {
    const requested = resolve_create_choices(options);
    const choices = await ask_create_choices(
      initial_name,
      requested.runtime,
      requested.language,
    );

    const setup_step = spinner();
    setup_step.start(chalk.cyan("Preparando projeto..."));

    const target_dir = await prepare_project_target(choices.name);

    setup_step.stop(chalk.green("✔ Projeto preparado"));

    const copy_step = spinner();
    copy_step.start(chalk.cyan("Gerando projeto..."));

    await setup_project({
      target_dir,
      choices,
    });

    copy_step.stop(chalk.green("✔ Projeto gerado e dependências instaladas"));

    outro(
      [
        chalk.green("🎉 Bot criado!"),
        "",
        chalk.cyan("Próximos passos:"),
        "",
        chalk.gray(`   cd ${choices.name}`),
        chalk.gray("   nexo dev"),
        "",
        chalk.gray("Docs: https://nexocord.vercel.app/"),
      ].join("\n"),
    );
  } finally {
    unbind_sigint();
  }
}
