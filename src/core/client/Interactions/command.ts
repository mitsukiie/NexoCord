import { MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import { App } from '../../index';
import type { NexoConfig } from '../../config';
import { extend_interaction } from '../../creators';
import { logger } from '../../utils';
import { ui } from '../../ui';

export async function Command(i: ChatInputCommandInteraction, config: NexoConfig) {
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
    const interaction = extend_interaction(i);

    await command.run(interaction, app.client, {
      ui,
    });

    app.cooldowns.set(id, name, command.cooldown ?? config.bot.cooldown);
  } catch (err) {
    logger.error(err);
    const msg = config.bot.errors.interaction;

    if (i.replied || i.deferred)
      await i.followUp({ content: msg, flags: [MessageFlags.Ephemeral] });
    else await i.reply({ content: msg, flags: [MessageFlags.Ephemeral] });
  }
}
