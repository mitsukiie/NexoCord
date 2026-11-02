import { Collection } from 'discord.js';
import type { Event } from '../../types';

/**
 * [pt-BR] Armazena os eventos configurados para o cliente.
 * [en] Stores events configured for the client.
 */
export class EventManager {
  private readonly events = new Collection<string, Event>();

  /**
   * [pt-BR] Adiciona ou substitui um evento pelo nome.
   * [en] Adds or replaces an event by name.
   */
  public add(event: Event) {
    this.events.set(event.name, event);
  }

  /**
   * [pt-BR] Busca um evento pelo nome.
   * [en] Finds an event by name.
   */
  public get(name: string) {
    return this.events.get(name);
  }

  /**
   * [pt-BR] Retorna todos os eventos registrados.
   * [en] Returns all registered events.
   */
  public all() {
    return Array.from(this.events.values());
  }

  /**
   * [pt-BR] Remove todos os eventos registrados.
   * [en] Removes all registered events.
   */
  public clear() {
    this.events.clear();
  }

  /**
   * [pt-BR] Retorna a quantidade de eventos registrados.
   * [en] Returns the number of registered events.
   */
  public size() {
    return this.events.size;
  }
}
