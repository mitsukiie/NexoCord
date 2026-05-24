import { ButtonStyle } from 'discord.js';

/** Branded type used for component custom ids. */
export type ButtonID = string & {};

/** Public button descriptor used by `ui.button(...)`. */
export type Button = {
  label: string;
  customId: ButtonID;
  emoji?: string;
  style?: ButtonStyle;
};
