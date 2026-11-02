import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  ContextMenuCommandInteraction,
  APIApplicationCommandOption,
  PermissionResolvable,
  PermissionFlagsBits,
} from "discord.js";

import { RunCommand, RunAutoComplete } from "./Run";

/**
 * Tipos de comandos que podem ser registrados no Discord.
 *
 * @description
 * [pt-BR] Use o valor que corresponde à forma como o usuário acionará o comando.
 * [en] Use the value that matches how users will invoke the command.
 */
export enum CommandType {
  /**
   * [pt-BR] Comando acionado por texto e opções.
   * [en] Command invoked with text and options.
   */
  ChatInput = ApplicationCommandType.ChatInput,
  /**
   * [pt-BR] Comando acionado ao selecionar um usuário.
   * [en] Command invoked by selecting a user.
   */
  User = ApplicationCommandType.User,
  /**
   * [pt-BR] Comando acionado ao selecionar uma mensagem.
   * [en] Command invoked by selecting a message.
   */
  Message = ApplicationCommandType.Message,
  /**
   * [pt-BR] Ponto de entrada principal de uma aplicação.
   * [en] Application primary entry point.
   */
  PrimaryEntryPoint = ApplicationCommandType.PrimaryEntryPoint,
}

/**
 * Interação do Discord recebida pelo callback de um comando.
 *
 * @description
 * [pt-BR] O tipo da interação é inferido a partir de `CommandType`.
 * [en] The interaction type is inferred from `CommandType`.
 */
export type CommandInteraction<Type extends CommandType = CommandType> =
  Type extends CommandType.ChatInput
    ? ChatInputCommandInteraction
    : Type extends CommandType.User
      ? UserContextMenuCommandInteraction
      : Type extends CommandType.Message
        ? MessageContextMenuCommandInteraction
        : Type extends CommandType.PrimaryEntryPoint
          ? ContextMenuCommandInteraction
          : never;

/**
 * Configuração de um comando registrado pelo NexoCord.
 *
 * @description
 * [pt-BR] Defina nome, descrição e callback `run`; use as opções adicionais para
 * controlar permissões, autocomplete e disponibilidade do comando.
 * [en] Define the name, description, and `run` callback; use the additional
 * options to control permissions, autocomplete, and command availability.
 *
 * @example
 * ```ts
 * createCommand({
 *   name: "ping",
 *   description: "Verifica a latência do bot",
 *   type: CommandType.ChatInput,
 *   run: (interaction) => interaction.reply({ content: "pong" }),
 * });
 * ```
 */
export type Command<Type extends CommandType = CommandType> = {
  /**
   * [pt-BR] Nome exibido no Discord.
   * [en] Name displayed on Discord.
   */
  name: string;
  /**
   * [pt-BR] Texto que explica o comando aos usuários.
   * [en] Text explaining the command to users.
   */
  description: string;
  /**
   * [pt-BR] Tipo de comando aceito pelo Discord.
   * [en] Command type accepted by Discord.
   */
  type: Type;
  /**
   * [pt-BR] Tempo mínimo, em segundos, entre usos do mesmo comando.
   * [en] Minimum time, in seconds, between uses of the same command.
   */
  cooldown?: number;
  /**
   * [pt-BR] Opções exibidas para um comando de entrada de texto.
   * [en] Options shown for a chat-input command.
   */
  options?: APIApplicationCommandOption[];

  /**
   * [pt-BR] Permissão padrão exigida do membro.
   * [en] Default permission required from the member.
   */
  defaultMemberPermission?: PermissionResolvable | null;
  /**
   * [pt-BR] Permissão que o bot precisa ter para executar o comando.
   * [en] Permission the bot needs to execute the command.
   */
  botpermission?: keyof typeof PermissionFlagsBits | null;
  /**
   * [pt-BR] Define se o comando pode ser usado em mensagens diretas.
   * [en] Whether the command can be used in direct messages.
   */
  dmPermission?: boolean;

  /**
   * [pt-BR] Define se o comando só pode ser usado em canais NSFW.
   * [en] Whether the command is restricted to NSFW channels.
   */
  nsfw?: boolean;
  /**
   * [pt-BR] IDs de usuários autorizados a usar o comando.
   * [en] User IDs allowed to use the command.
   */
  allowIds?: string[] | null;

  /**
   * [pt-BR] Callback para completar opções durante o preenchimento.
   * [en] Callback that completes options while they are being filled in.
   */
  autocomplete?: RunAutoComplete;
  /**
   * [pt-BR] Callback executado quando o comando é usado.
   * [en] Callback executed when the command is used.
   */
  run: RunCommand<Type>;
};
