import { ClientEvents } from 'discord.js';
import { RunEvent } from './Run';

/**
 * Configuração de um evento do cliente do Discord.
 *
 * @description
 * [pt-BR] Use `run` para reagir aos eventos recebidos pelo cliente.
 * [en] Use `run` to react to events received by the client.
 */
export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
  /**
   * [pt-BR] Nome do evento do Discord.js.
   * [en] Discord.js event name.
   */
  name: K;
  /**
   * [pt-BR] Executa o callback uma única vez quando o evento ocorrer.
   * [en] Runs the callback only once when the event occurs.
   */
  once?: boolean;
  /**
   * [pt-BR] Callback executado pelo evento.
   * [en] Callback executed by the event.
   */
  run: RunEvent<K>;
};
