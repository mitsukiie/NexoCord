import {
  Client,
  type ClientOptions,
  GatewayIntentBits,
  Partials,
} from "discord.js";

interface ExtendedClientOptions {
  intents?: ClientOptions["intents"];
  partials?: ClientOptions["partials"];
}

const intents: NonNullable<ClientOptions["intents"]> = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

const partials: NonNullable<ClientOptions["partials"]> = [
  Partials.Channel,
  Partials.Message,
];

export class ExtendedClient extends Client {
  constructor(options: ExtendedClientOptions = {}) {
    super({
      intents: options.intents ?? intents,
      partials: options.partials ?? partials,
    });
  }
}
