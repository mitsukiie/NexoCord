import { Command, CommandType } from '../types';

/**
 * Cria uma configuração de comando pronta para ser exportada pelo projeto.
 *
 * @description
 * [pt-BR] Valida a configuração em TypeScript e preserva o tipo da interação
 * recebida no callback.
 * [en] Provides TypeScript validation and preserves the interaction type
 * received by the callback.
 *
 * @param command - [pt-BR] Configuração do comando.
 * [en] Command configuration.
 *
 * @example
 * export default createCommand({
 *   name: "ping",
 *   description: "Responde com pong.",
 *   type: CommandType.ChatInput,
 *   run: (ctx) => ctx.reply({ content: "pong" }),
 * });
 */
export function createCommand<T extends CommandType>(command: Command<T>) {
  return command;
}
