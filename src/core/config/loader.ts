import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { default_config } from "./defaults";
import type { NexoConfig } from "./types";
import { parse_config_file } from "./parse";
import { validate_config_overrides } from "./validate";

type ConfigOverrides = {
  directories?: Partial<NexoConfig["directories"]>;

  terminal?: {
    mode?: NexoConfig["terminal"]["mode"];
    commands?: Partial<NexoConfig["terminal"]["commands"]>;
    events?: Partial<NexoConfig["terminal"]["events"]>;
  };

  bot?: {
    cooldown?: number;
    guildID?: string[];
    errors?: Partial<NexoConfig["bot"]["errors"]>;
  };
};

export function merge_config(
  defaults: NexoConfig,
  overrides: ConfigOverrides,
): NexoConfig {
  return {
    directories: {
      ...defaults.directories,
      ...overrides.directories,
    },

    terminal: {
      ...defaults.terminal,
      ...overrides.terminal,

      commands: {
        ...defaults.terminal.commands,
        ...overrides.terminal?.commands,
      },

      events: {
        ...defaults.terminal.events,
        ...overrides.terminal?.events,
      },
    },

    bot: {
      ...defaults.bot,
      ...overrides.bot,

      errors: {
        ...defaults.bot.errors,
        ...overrides.bot?.errors,
      },
    },
  };
}

export function load_config(): NexoConfig {
  const json_path = resolve(process.cwd(), "nexocord.json");
  const config_path = resolve(process.cwd(), "nexocord.config");

  const has_json = existsSync(json_path);
  const has_config = existsSync(config_path);

  if (has_json && has_config) {
    throw new Error(
      [
        "Foram encontrados dois arquivos de configuração do NexoCord.",
        "",
        "Escolha apenas um dos formatos:",
        "  • nexocord.json",
        "  • nexocord.config",
        "",
        "Remova ou renomeie um dos arquivos para continuar.",
      ].join("\n"),
    );
  }

  let overrides: unknown = {};

  if (has_json) {
    overrides = JSON.parse(readFileSync(json_path, "utf8"));
  } else if (has_config) {
    overrides = parse_config_file(readFileSync(config_path, "utf8"));
  }

  const validated = validate_config_overrides(overrides);

  return merge_config(default_config, validated);
}
