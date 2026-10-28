
import path from "node:path";

import {
  cancel,
  confirm,
  intro,
  isCancel,
  log as prompt_log,
  outro,
  spinner,
} from "@clack/prompts";

import chalk from "chalk";

import { setup_project } from "../project/setup";
import { configure_package_json } from "../project/package-json";
import { ask_language, ask_runtime } from "../project/prompts";

import {
  detect_project,
  get_project_paths,
  read_package_json,
  resolve_init_choices,
  write_package_json,
} from "./project";

import type { InitOptions } from "./types";

export type { InitOptions } from "./types";

function stop_on_sigint(): () => void {
  const on_sigint = () => {
    cancel(chalk.yellow("Operação cancelada."));
    process.exitCode = 130;
  };

  process.once("SIGINT", on_sigint);

  return () => process.off("SIGINT", on_sigint);
}

export async function run_init_flow(
  options: InitOptions,
): Promise<void> {
  const unbind_sigint = stop_on_sigint();

  try {
    const { target_dir, package_path } = get_project_paths();
    const package_json = read_package_json(package_path);
    const detected = detect_project(target_dir, package_json);
    const requested = resolve_init_choices(options);

    intro(chalk.cyan("🚀 NexoCord"));

    if (detected.has_nexo_configuration) {
      prompt_log.warn(
        chalk.yellow(
          "Este projeto já possui dependências ou scripts do NexoCord.",
        ),
      );

      const should_continue = await confirm({
        message:
          "Deseja continuar? Arquivos existentes serão preservados e scripts já definidos não serão sobrescritos.",
        initialValue: false,
      });

      if (isCancel(should_continue) || !should_continue) {
        outro(
          chalk.yellow(
            "Operação cancelada. Nenhuma alteração foi feita.",
          ),
        );
        return;
      }
    }

    const runtime =
      requested.runtime ?? (await ask_runtime(detected.runtime));

    const language =
      requested.language ?? (await ask_language(detected.language));

    const expected_type =
      language === "typescript" ? "module" : "commonjs";

    let update_type = package_json.type === undefined;

    if (
      package_json.type !== undefined &&
      package_json.type !== expected_type
    ) {
      const confirmation = await confirm({
        message:
          `O projeto usa "type": "${package_json.type}", ` +
          `mas ${language} requer "${expected_type}". Deseja atualizar?`,
        initialValue: true,
      });

      if (isCancel(confirmation) || !confirmation) {
        outro(
          chalk.yellow(
            "Operação cancelada. Nenhuma alteração foi feita.",
          ),
        );
        return;
      }

      update_type = true;
    }

    const choices = {
      name:
        typeof package_json.name === "string" && package_json.name
          ? package_json.name
          : path.basename(target_dir),
      runtime,
      language,
    };

    prompt_log.step(
      chalk.cyan(
        `📦 Adicionando NexoCord com ${language} e ${runtime}...`,
      ),
    );

    configure_package_json(
      package_json,
      choices,
      update_type,
    );

    write_package_json(package_path, package_json);

    const setup_step = spinner();
    setup_step.start(chalk.cyan("Gerando template inicial..."));

    await setup_project({
      target_dir,
      choices,
      generate: {
        create_package_json: false,
        overwrite_files: false,
      },
    });

    setup_step.stop(
      chalk.green("✔ Template gerado e dependências instaladas."),
    );

    outro(
      [
        chalk.green("🎉 NexoCord configurado no projeto existente!"),
        "",
        chalk.cyan("Próximos passos:"),
        "",
        chalk.gray("   nexo dev"),
        "",
        chalk.gray("Docs: https://nexocord.vercel.app/"),
      ].join("\n"),
    );
  } finally {
    unbind_sigint();
  }
}
