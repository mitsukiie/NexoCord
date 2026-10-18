import { AutocompleteInteraction, ClientEvents } from "discord.js";
import type { ExtendedClient } from "../client/ExtendedClient";
import type { CommandContext } from "../creators";
import type { CommandType } from "./Command";
import type { ResponderParse } from "./Responder";

// Run event
export type RunEvent<K extends keyof ClientEvents = keyof ClientEvents> = (
  ...args: [...ClientEvents[K], ExtendedClient]
) => any;

// Run slash command
export type RunCommand<T extends CommandType> = (
  ctx: CommandContext<T>,
) => Promise<unknown> | unknown;

// Run responder
export type RunResponder<I, Path extends string, P = undefined> = (
  interaction: I,
  params: ResponderParse<P, Path>,
) => unknown | Promise<unknown>;

export type RunAutoComplete = (
  i: AutocompleteInteraction,
  focused: string,
) => any;
