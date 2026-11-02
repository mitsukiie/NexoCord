import { ExtendedClient, App } from '../index';
import { logger } from '../utils';
import { load_commands, load_events } from '../modules';

import { set_global_settings } from '../settings';
import { NexoConfig, load_config, BootstrapOptions } from '../config';
import { Router } from './Interactions';

/**
 * Ponto de entrada para configurar e iniciar um bot NexoCord.
 *
 * [pt-BR] Inicializa o cliente, carrega comandos e eventos e conecta o bot ao Discord.
 * [en] Initializes the client, loads commands and events, and connects the bot to Discord.
 */
const Bootstrap = {
  /**
   * Inicia o cliente, carrega comandos e eventos e conecta o bot ao Discord.
   *
   * [pt-BR] O token pode ser informado nas opções ou pela variável de ambiente `TOKEN`.
   * [en] The token can be provided in the options or through the `TOKEN` environment variable.
   *
   * @param options - [pt-BR] Token e opções do cliente.
   * [en] Token and client options.
   */
  async init(options: BootstrapOptions) {
    const token = options.token ?? process.env.TOKEN ?? '';

    let config: NexoConfig;

    try {
      config = load_config();
    } catch (error) {
      logger.error(error, 'Erro ao carregar a configuração do bot.');
      return;
    }

    logger.configure(config);

    if (options.settings) set_global_settings(options.settings);

    const client = new ExtendedClient({
      intents: options.intents,
      partials: options.partials,
    });

    App.init(client);
    client.on('interactionCreate', (interaction) => Router(interaction, config));

    try {
      if (!token) {
        logger.error('Token não fornecido!');
        process.exit(1);
      }

      await load_events(config, client);

      await client.login(token);

      await load_commands(config, client, token);
    } catch (error) {
      logger.error('Erro ao iniciar o bot:');
      console.error(error);
    }
  },
};

export { Bootstrap };
