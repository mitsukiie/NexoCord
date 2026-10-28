import type { ClientOptions } from "discord.js";

export interface NexoConfig {
  directories: {
    commands: string;
    events: string;
  };

  terminal: {
    mode: "informativo" | "minimalista";

    commands: {
      showFiles: boolean;
      showRegistered: boolean;
      registeredMessage: string;
    };

    events: {
      showFiles: boolean;
      showRegistered: boolean;
      registeredMessage: string;
    };
  };

  bot: {
    cooldown: number;
    guildID: string[];
    errors: {
      interaction: string;
    };
  };
}

export interface BootstrapOptions {
  token?: string;
  intents?: ClientOptions["intents"];
  partials?: ClientOptions["partials"];
  settings?: Record<string, any>;
}
