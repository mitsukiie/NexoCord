import { AutocompleteInteraction, ClientEvents } from "discord.js";
import type { ExtendedClient } from "../client/ExtendedClient";
import type { ui } from "../ui";
import type { ExtendedInteraction } from "../creators";
import type { CommandType, CommandInteraction } from "./Command";
import type { ResponderParse } from "./Responder";

/**
 * [pt-BR] Callback usado para tratar um evento do Discord.
 * [en] Callback used to handle a Discord event.
 */
export type RunEvent<K extends keyof ClientEvents = keyof ClientEvents> = (
  ...args: [...ClientEvents[K], ExtendedClient]
) => any;

/**
 * [pt-BR] Dependências oferecidas ao callback de um comando.
 * [en] Dependencies provided to a command callback.
 */
export type CommandDependencies = {
  /**
   * [pt-BR] API declarativa para criar componentes de mensagem.
   * [en] Declarative API for creating message components.
   */
  ui: typeof ui;
}
/**
 * [pt-BR] Callback executado por um comando.
 * [en] Callback executed by a command.
 */
export type RunCommand<T extends CommandType> = (
  interaction: ExtendedInteraction<CommandInteraction<T>>,
  client: ExtendedClient,
  dependencies: CommandDependencies,
) => Promise<unknown> | unknown;

/**
 * [pt-BR] Callback executado por um responder.
 * [en] Callback executed by a responder.
 */
export type RunResponder<I, Path extends string, P = undefined> = (
  interaction: I,
  params: ResponderParse<P, Path>,
) => unknown | Promise<unknown>;

/**
 * [pt-BR] Callback para autocomplete de opções.
 * [en] Callback for option autocomplete.
 */
export type RunAutoComplete = (
  i: AutocompleteInteraction,
  focused: string,
) => any;
