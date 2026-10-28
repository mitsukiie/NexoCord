import chalk from "chalk";
import type { NexoConfig } from "../config";

type LogMode = NexoConfig["terminal"]["mode"];

let mode: LogMode = "minimalista";

function configure_logger(config: NexoConfig): void {
  mode = config.terminal.mode;
}

function timestamp(): string {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function log(level: "INFO" | "WARN" | "ERROR" | "SUCCESS", msg: unknown): void {
  const message = String(msg);

  if (mode === "informativo") {
    const prefix = `[${level}] [${timestamp()}] ${message}`;

    switch (level) {
      case "INFO":
        console.log(chalk.blueBright(prefix));
        break;
      case "WARN":
        console.warn(chalk.yellowBright(prefix));
        break;
      case "ERROR":
        console.error(chalk.redBright(prefix));
        break;
      case "SUCCESS":
        console.log(chalk.greenBright(prefix));
        break;
    }

    return;
  }

  switch (level) {
    case "INFO":
      console.log(chalk.blueBright(message));
      break;
    case "WARN":
      console.warn(chalk.yellowBright(message));
      break;
    case "ERROR":
      console.error(chalk.redBright(`${message}`));
      break;
    case "SUCCESS":
      console.log(chalk.greenBright(message));
      break;
  }
}

/** Exibe mensagens de log respeitando o modo configurado do NexoCord. */
export const logger = {
  /** Aplica o modo de saída definido na configuração do bot. */
  configure: configure_logger,
  /** Exibe uma mensagem informativa. */
  info: (msg: unknown) => log("INFO", msg),
  /** Exibe um aviso. */
  warn: (msg: unknown) => log("WARN", msg),
  /** Exibe um erro. */
  error: (msg: unknown) => log("ERROR", msg),
  /** Exibe uma mensagem de sucesso. */
  success: (msg: unknown) => log("SUCCESS", msg),
};
