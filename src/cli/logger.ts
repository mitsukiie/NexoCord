import chalk from "chalk";

export const log = {
  start: () => {
    console.log("\n" + chalk.cyan.bold("🚀 NexoCord"));
  },

  title: (message: string) => {
    console.log("\n" + chalk.cyan.bold(message));
  },

  success: (message: string) => {
    console.log(chalk.green(`✔ ${message}`));
  },

  info: (message: string) => {
    console.log(chalk.blue(`ℹ ${message}`));
  },

  warn: (message: string) => {
    console.log(chalk.yellow(`⚠ ${message}`));
  },

  error: (message: string) => {
    console.error(chalk.red(`✖ ${message}`));
  },

  debug: (message: string) => {
    console.log(chalk.gray(`› ${message}`));
  },

  runtime: (runtime: string) => {
    console.log(chalk.blue("⚙ Runtime: ") + chalk.magenta(runtime));
  },

  env: (file = ".env") => {
    console.log(chalk.green(`${file} encontrado`));
  },

  watch: () => {
    console.log(chalk.yellow("👀 Watch mode ativo"));
    console.log(chalk.gray("📡 Aguardando alterações..."));
    console.log(chalk.gray("💡 Ctrl+C para parar\n"));
  },
};
