import { Command, CommandType } from "../types";

/**
 * Cria uma configuração de comando preservando a inferência do tipo de interação.
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
