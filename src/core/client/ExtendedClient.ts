import { Client, type ClientOptions, GatewayIntentBits, Partials } from 'discord.js';

interface ExtendedClientOptions {
  intents?: ClientOptions['intents'];
  partials?: ClientOptions['partials'];
}

const intents: NonNullable<ClientOptions['intents']> = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

const partials: NonNullable<ClientOptions['partials']> = [
  Partials.Channel,
  Partials.Message,
];

/**
 * Cliente Discord.js com as opções padrão usadas pelo NexoCord.
 *
 * [pt-BR] Instancie-o quando precisar configurar o cliente manualmente.
 * [en] Instantiate it when you need to configure the client manually.
 */
export class ExtendedClient extends Client {
  constructor(options: ExtendedClientOptions = {}) {
    super({
      intents: options.intents ?? intents,
      partials: options.partials ?? partials,
    });
  }
}
