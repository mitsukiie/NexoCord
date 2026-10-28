import { ClientEvents } from "discord.js";
import { RunEvent } from "./Run";

/** Configuração de um evento do cliente do Discord. */
export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
  name: K;
  once?: boolean;
  run: RunEvent<K>;
};
