import { cancel, intro, outro, spinner } from "@clack/prompts";
import chalk from "chalk";

import {
  generate_project,
  prepare_project_target,
} from "./generator";

import { get_error_message } from "../../errors";
import { install_dependencies } from "./install";
import { ask_create_choices } from "./prompts";

function stop_on_sigint(): () => void {
  const on_sigint = () => {
    cancel(chalk.yellow("Operação cancelada."));
    process.exitCode = 130;
  };

  process.once("SIGINT", on_sigint);

  return () => {
    process.off("SIGINT", on_sigint);
  };
}

export async function run_create_flow(initial_name?: string): Promise<void> {
  intro(chalk.cyan("🚀 NexoCord"));

  const unbind_sigint = stop_on_sigint();

  try {
    const choices = await ask_create_choices(initial_name);

    const setup_step = spinner();
    setup_step.start(chalk.cyan("Preparando projeto..."));

    const target_dir = await prepare_project_target(choices.name);

    setup_step.stop(chalk.green("✔ Projeto preparado"));

    const copy_step = spinner();
    copy_step.start(chalk.cyan("Copiando template..."));

    const result = await generate_project(choices, target_dir);

    copy_step.stop(chalk.green("✔ Template copiado"));

    const install_step = spinner();
    install_step.start(chalk.cyan("Instalando dependências..."));

    await install_dependencies(result.target_dir, result.runtime);

    install_step.stop(chalk.green("✔ Dependências instaladas"));

    outro(
      [
        chalk.green("🎉 Bot criado!"),
        "",
        chalk.cyan("Próximos passos:"),
        "",
        chalk.gray(`   cd ${result.project_name}`),
        chalk.gray("   nexo dev"),
        "",
        chalk.gray("Docs: https://nexocord.vercel.app/"),
      ].join("\n"),
    );
  } catch (error: unknown) {
    cancel(chalk.red(get_error_message(error)));
    throw error;
  } finally {
    unbind_sigint();
  }
}
