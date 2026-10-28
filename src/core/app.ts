import { ExtendedClient } from "./index";
import { CommandManager, EventManager, ResponderManager } from "./modules";
import { CooldownManager } from "./utils/cooldown";

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
