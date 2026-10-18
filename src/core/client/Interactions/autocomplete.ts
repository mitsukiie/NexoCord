import { type AutocompleteInteraction } from "discord.js";
import { App } from "@base";

export async function AutoComplete(i: AutocompleteInteraction) {
  const app = App.get();
  const command = app.commands.get(i.commandName);

  if (!command?.autocomplete) return;

  const focused = i.options.getFocused();
  await command.autocomplete(i, focused);
}
