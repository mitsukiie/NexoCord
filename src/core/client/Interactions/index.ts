import { is_responder } from "../../utils/responder";
import { Command } from "./command";
import { AutoComplete } from "./autocomplete";
import { Responder } from "./responder";

import { type Interaction } from "discord.js";

export async function Router(i: Interaction) {
  if (i.isChatInputCommand()) return Command(i);
  if (i.isAutocomplete()) return AutoComplete(i);
  if (is_responder(i)) return Responder(i);
}
