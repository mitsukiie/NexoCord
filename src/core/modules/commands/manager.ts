import { Collection } from "discord.js";
import type { Command } from "../../types";

/** Armazena os comandos disponíveis para o cliente. */
export class CommandManager {
  private readonly commands = new Collection<string, Command>();

  /** Adiciona ou substitui um comando pelo nome. */
  public add(command: Command) {
    this.commands.set(command.name, command);
  }

  /** Busca um comando pelo nome. */
  public get(name: string) {
    return this.commands.get(name);
  }

  /** Retorna todos os comandos registrados. */
  public all() {
    return Array.from(this.commands.values());
  }

  /** Remove todos os comandos registrados. */
  public clear() {
    this.commands.clear();
  }

  /** Retorna a quantidade de comandos registrados. */
  public size() {
    return this.commands.size;
  }
}
