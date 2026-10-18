import chalk from "chalk";

async function info(msg: any) {
  switch (settings.terminal.mode) {
    case "informativo":
      const date = new Date();
      console.log(
        chalk.blueBright(
          `[INFO] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case "minimalista":
      console.log(chalk.blueBright(`${msg}`));
      break;

    default:
      break;
  }
}

async function warn(msg: any) {
  switch (settings.terminal.mode) {
    case "informativo":
      const date = new Date();
      console.log(
        chalk.yellowBright(
          `[WARN] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case "minimalista":
      console.log(chalk.yellowBright(`${msg}`));
      break;

    default:
      break;
  }
}

async function error(msg: any) {
  switch (settings.terminal.mode) {
    case "informativo":
      const date = new Date();
      console.error(
        chalk.redBright(
          `[ERROR] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case "minimalista":
      console.error(chalk.redBright(`✗ ${msg}`));
      break;

    default:
      break;
  }
}

async function success(msg: any) {
  switch (globalThis.settings?.terminal?.mode ?? "informativo") {
    case "informativo":
      const date = new Date();
      console.log(
        chalk.greenBright(
          `[SUCCESS] [${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}] ${msg}`,
        ),
      );
      break;

    case "minimalista":
      console.log(chalk.greenBright(`${msg}`));
      break;

    default:
      break;
  }
}

export const logger = {
  info,
  warn,
  success,
  error,
};
