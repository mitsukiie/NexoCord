import { is_responder } from "../../utils/responder";
import { Command } from "./command";
import { AutoComplete } from "./autocomplete";
import { Responder } from "./responder";

import { type Interaction } from "discord.js";
import type { NexoConfig } from "../../config";

export async function Router(i: Interaction, config: NexoConfig) {
  if (i.isChatInputCommand()) return Command(i, config);
  if (i.isAutocomplete()) return AutoComplete(i);
  if (is_responder(i)) return Responder(i);
}
