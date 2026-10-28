import { MessageFlags, ChatInputCommandInteraction } from "discord.js";
import { App } from "../../index";
import type { NexoConfig } from "../../config";
import { create_context } from "../../creators";
import { handle_error } from "../../utils";

export async function Command(
  i: ChatInputCommandInteraction,
  config: NexoConfig,
) {
  const app = App.get();

  const name = i.commandName;
  const id = i.user.id;
  const command = app.commands.get(name);

  if (!command) return;

  if (app.cooldowns.isOnCooldown(id, name)) {
    const remaining = app.cooldowns.get(id, name) / 1000;
    return i.reply({
      content: `⏳ Calma aí! Você precisa esperar **${remaining.toFixed(1)}s** antes de usar esse comando de novo.`,
      flags: [MessageFlags.Ephemeral],
    });
  }

  try {
    const ctx = create_context(i, app.client);

    await command.run(ctx);

    app.cooldowns.set(id, name, command.cooldown ?? config.bot.cooldown);
  } catch (err) {
    handle_error(err);
    const msg = config.bot.errors.interaction;

    if (i.replied || i.deferred)
      await i.followUp({ content: msg, flags: [MessageFlags.Ephemeral] });
    else await i.reply({ content: msg, flags: [MessageFlags.Ephemeral] });
  }
}
