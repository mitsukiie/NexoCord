import { ClientEvents } from "discord.js";
import { Event } from "../types";

/**
 * Cria uma configuração de evento.
 *
 * [pt-BR] Use o helper ao exportar um evento para obter os argumentos corretos
 * no callback `run`.
 * [en] Use this helper when exporting an event to receive the correct arguments
 * in the `run` callback.
 *
 * @param event - [pt-BR] Configuração do evento.
 * [en] Event configuration.
 */
export function createEvent<K extends keyof ClientEvents>(event: Event<K>) {
  return event;
}
