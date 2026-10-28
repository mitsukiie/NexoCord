import { ClientEvents } from "discord.js";
import { Event } from "../types";

/** Cria uma configuração de evento preservando o tipo dos argumentos recebidos. */
export function createEvent<K extends keyof ClientEvents>(event: Event<K>) {
  return event;
}
