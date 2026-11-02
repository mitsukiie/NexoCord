import { Collection } from 'discord.js';
import type { Command } from '../../types';

/**
 * [pt-BR] Armazena os comandos disponíveis para o cliente.
 * [en] Stores commands available to the client.
 */
export class CommandManager {
  private readonly commands = new Collection<string, Command>();

  /**
   * [pt-BR] Adiciona ou substitui um comando pelo nome.
   * [en] Adds or replaces a command by name.
   */
  public add(command: Command) {
    this.commands.set(command.name, command);
  }

  /**
   * [pt-BR] Busca um comando pelo nome.
   * [en] Finds a command by name.
   */
  public get(name: string) {
    return this.commands.get(name);
  }

  /**
   * [pt-BR] Retorna todos os comandos registrados.
   * [en] Returns all registered commands.
   */
  public all() {
    return Array.from(this.commands.values());
  }

  /**
   * [pt-BR] Remove todos os comandos registrados.
   * [en] Removes all registered commands.
   */
  public clear() {
    this.commands.clear();
  }

  /**
   * [pt-BR] Retorna a quantidade de comandos registrados.
   * [en] Returns the number of registered commands.
   */
  public size() {
    return this.commands.size;
  }
}
