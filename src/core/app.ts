import { ExtendedClient } from "./index";
import { CommandManager, EventManager, ResponderManager } from "./modules";
import { CooldownManager } from "./utils/cooldown";

/**
 * Acesso aos serviços registrados na instância do NexoCord.
 *
 * [pt-BR] Normalmente é inicializado pelo bootstrap; use `App.get()` apenas
 * quando sua integração precisar acessar esses serviços.
 * [en] It is normally initialized by the bootstrap; use `App.get()` only when
 * your integration needs access to these services.
 */
export class App {
  private static instance: App;

  public readonly client: ExtendedClient;
  public readonly commands: CommandManager;
  public readonly events: EventManager;
  public readonly responders: ResponderManager;
  public readonly cooldowns: CooldownManager;

  private constructor(client: ExtendedClient) {
    this.client = client;
    this.commands = new CommandManager();
    this.events = new EventManager();
    this.responders = new ResponderManager();
    this.cooldowns = new CooldownManager();
  }

  public static init(client: ExtendedClient) {
    if (!this.instance) {
      this.instance = new App(client);
    }
    return this.instance;
  }

  public static get() {
    if (!this.instance) {
      throw new Error("App não inicializado");
    }
    return this.instance;
  }
}
