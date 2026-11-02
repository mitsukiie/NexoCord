import chalk from 'chalk';
import type { NexoConfig } from '../config';

type LogMode = NexoConfig['terminal']['mode'];

let mode: LogMode = 'minimalista';

function configure_logger(config: NexoConfig): void {
  mode = config.terminal.mode;
}

function timestamp(): string {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function log(level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', msg: unknown): void {
  const message = String(msg);

  if (mode === 'informativo') {
    const prefix = `[${level}] [${timestamp()}] ${message}`;

    switch (level) {
      case 'INFO':
        console.log(chalk.blueBright(prefix));
        break;
      case 'WARN':
        console.warn(chalk.yellowBright(prefix));
        break;
      case 'ERROR':
        console.error(chalk.redBright(prefix));
        break;
      case 'SUCCESS':
        console.log(chalk.greenBright(prefix));
        break;
    }

    return;
  }

  switch (level) {
    case 'INFO':
      console.log(chalk.blueBright(message));
      break;
    case 'WARN':
      console.warn(chalk.yellowBright(message));
      break;
    case 'ERROR':
      console.error(chalk.redBright(`${message}`));
      break;
    case 'SUCCESS':
      console.log(chalk.greenBright(message));
      break;
  }
}

function error(error: unknown, fallback = 'Ocorreu um erro inesperado.'): void {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    message =
      'message' in error && typeof error.message === 'string'
        ? error.message
        : (JSON.stringify(error) ?? fallback);
  } else {
    message = fallback;
  }

  log('ERROR', `✗ ${message}`);
  process.exitCode = 1;
}

/**
 * Exibe mensagens de log respeitando o modo configurado do NexoCord.
 *
 * [pt-BR] Use o logger para mostrar informações, avisos, erros e confirmações
 * no terminal.
 * [en] Use the logger to display information, warnings, errors, and success
 * messages in the terminal.
 */
export const logger = {
  /**
   * [pt-BR] Aplica o modo de saída definido na configuração do bot.
   * [en] Applies the output mode defined by the bot configuration.
   */
  configure: configure_logger,
  /**
   * [pt-BR] Exibe uma mensagem informativa.
   * [en] Displays an informational message.
   */
  info: (msg: unknown) => log('INFO', msg),
  /**
   * [pt-BR] Exibe um aviso.
   * [en] Displays a warning.
   */
  warn: (msg: unknown) => log('WARN', msg),
  /**
   * [pt-BR] Exibe um erro.
   * [en] Displays an error.
   */
  error,
  /**
   * [pt-BR] Exibe uma mensagem de sucesso.
   * [en] Displays a success message.
   */
  success: (msg: unknown) => log('SUCCESS', msg),
};
