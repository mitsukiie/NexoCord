export type TerminalMode = "informativo" | "minimalista";

export interface Settings {
  terminal: {
    mode: TerminalMode;
    showSlashCommandsFiles?: boolean;
    showSlashCommandsRegistred?: boolean;
    showEventsFiles?: boolean;
    showEventsRegistred?: boolean;
  };
  bot: {
    cooldown: number;
    guildID: string[];
  };
  custom?: Record<string, any>;
}

export type PartialSettings = Partial<{
  terminal: Partial<Settings["terminal"]>;
  bot: Partial<Settings["bot"]>;
  custom?: Record<string, any>;
}>;
