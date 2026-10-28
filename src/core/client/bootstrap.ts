import { ExtendedClient, App } from "../index";
import { logger, handle_error } from "../utils";
import { load_commands, load_events } from "../modules";

import { set_global_settings } from "../settings";
import { NexoConfig, load_config, BootstrapOptions } from "../config";
import { Router } from "./Interactions";

/** Ponto de entrada para configurar e iniciar um bot NexoCord. */
const Bootstrap = {
  /**
   * Inicia o cliente, carrega comandos e eventos e conecta o bot ao Discord.
   *
   * O token pode ser informado nas opções ou pela variável de ambiente `TOKEN`.
   */
  async init(options: BootstrapOptions) {
    const token = options.token ?? process.env.TOKEN ?? "";

    let config: NexoConfig;

    try {
      config = load_config();
    } catch (error) {
      handle_error(error, "Erro ao carregar a configuração do bot.");
      return;
    }

    logger.configure(config);

    if (options.settings) set_global_settings(options.settings);

    const client = new ExtendedClient({
      intents: options.intents,
      partials: options.partials,
    });

    App.init(client);
    client.on("interactionCreate", (interaction) =>
      Router(interaction, config),
    );

    try {
      if (!token) {
        logger.error("Token não fornecido!");
        process.exit(1);
      }

      await load_events(config, client);

      await client.login(token);

      await load_commands(config, client, token);
    } catch (error) {
      logger.error("Erro ao iniciar o bot:");
      console.error(error);
    }
  },
};

export { Bootstrap };
