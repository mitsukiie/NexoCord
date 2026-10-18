import { Command } from "commander";
import chalk from "chalk";

import { get_error_message, NexoError } from "./errors";
import { log } from "./logger";

export function create_program(version: string): Command {
  const program = new Command();

  program
    .name("nexo")
    .description(
      "Framework moderno para bots Discord com foco em DX e performance",
    )
    .version(version)
    .option("--verbose", "Exibe informações detalhadas")
    .addHelpText(
      "after",
      `\n${chalk.cyan("Docs:")} ${chalk.gray(
        "https://nexocord.vercel.app/",
      )}\n`,
    );

  return program;
}

export function register_fallback(program: Command): void {
  program.on("command:*", (commands: string[]) => {
    const command = commands.join(" ");

    log.error(`Comando desconhecido: ${command}`);
    console.log(
      chalk.gray(
        "\nUse " + chalk.white("nexo --help") + " para ver os comandos.",
      ),
    );
  });
}

export async function run_program(
  program: Command,
  argv: string[] = process.argv,
): Promise<number> {
  try {
    await program.parseAsync(argv);

    return 0;
  } catch (error: unknown) {
    const verbose = program.opts().verbose === true;

    if (error instanceof NexoError) {
      log.error(error.message);

      if (verbose) {
        console.error(chalk.gray(`\nCódigo: ${error.code}`));
      }

      return error.exit_code;
    }

    log.error(get_error_message(error));

    if (verbose && error instanceof Error && error.stack) {
      console.error(chalk.gray(`\n${error.stack}`));
    }

    return 1;
  }
}
