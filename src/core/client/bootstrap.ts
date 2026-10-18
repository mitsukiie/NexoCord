import type { ClientOptions } from "discord.js";

import { ExtendedClient, App } from "@base";
import { logger } from "@utils";
import { load_commands, load_events } from "@modules";

import type { PartialSettings } from "@types";
import { setGlobalSettings } from "../settings";

import { Router } from "./Interactions";

interface Paths {
  commands: string;
  events: string;
}

interface Options {
  token?: string;
  intents?: ClientOptions["intents"];
  partials?: ClientOptions["partials"];
  paths?: Partial<Paths>;
  settings?: PartialSettings;
}

const Bootstrap = {
  async init(options: Options) {
    const Token = options.token ?? process.env.TOKEN ?? "";
    const paths: Paths = {
      commands: options.paths?.commands ?? "src/commands",
      events: options.paths?.events ?? "src/events",
    };

    setGlobalSettings({
      ...(options.settings ?? {}),
      bot: {
        ...(options.settings?.bot ?? {}),
      },
    });

    const client = new ExtendedClient({
      intents: options.intents,
      partials: options.partials,
    });

    App.init(client);
    client.on("interactionCreate", (interaction) => Router(interaction));

    try {
      // valida token
      if (!Token) {
        logger.error("Token não fornecido!");
        process.exit(1);
      }

      await load_events(client, paths.events);
      await client.login(Token);
      await load_commands(client, Token, paths.commands);
    } catch (error) {
      console.error(error);
    }
  },
};

export { Bootstrap };
