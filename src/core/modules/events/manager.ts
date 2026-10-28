import { Collection } from "discord.js";
import type { Event } from "../../types";

/** Armazena os eventos configurados para o cliente. */
export class EventManager {
  private readonly events = new Collection<string, Event>();

  /** Adiciona ou substitui um evento pelo nome. */
  public add(event: Event) {
    this.events.set(event.name, event);
  }

  /** Busca um evento pelo nome. */
  public get(name: string) {
    return this.events.get(name);
  }

  /** Retorna todos os eventos registrados. */
  public all() {
    return Array.from(this.events.values());
  }

  /** Remove todos os eventos registrados. */
  public clear() {
    this.events.clear();
  }

  /** Retorna a quantidade de eventos registrados. */
  public size() {
    return this.events.size;
  }
}
