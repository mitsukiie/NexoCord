import type { Settings, PartialSettings } from "@types";

export const defaultSettings: Settings = {
  terminal: {
    mode: "minimalista",
    showSlashCommandsFiles: false,
    showSlashCommandsRegistred: true,
    showEventsFiles: false,
    showEventsRegistred: true,
  },
  bot: {
    cooldown: 3,
    guildID: [],
  },
  custom: {},
};

declare global {
  var settings: Settings;
}

export function setGlobalSettings(settings?: PartialSettings): Settings {
  globalThis.settings = {
    terminal: {
      ...defaultSettings.terminal,
      ...(settings?.terminal ?? {}),
    },
    bot: {
      ...defaultSettings.bot,
      ...(settings?.bot ?? {}),
    },
    custom: {
      ...defaultSettings.custom,
      ...(settings?.custom ?? {}),
    },
  };

  return globalThis.settings;
}
