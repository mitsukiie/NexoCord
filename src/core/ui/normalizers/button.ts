import { ButtonBuilder, ButtonStyle } from 'discord.js';

import type { Button } from '../types';

/** Converte um botão do NexoCord em um ButtonBuilder. */
export function normalize_button(button: Button): ButtonBuilder {
  const builder = new ButtonBuilder()
    .setLabel(button.label)
    .setDisabled(button.disabled ?? false);

  if (button.emoji !== undefined) {
    builder.setEmoji(button.emoji);
  }

  if (button.url !== undefined) {
    builder.setStyle(ButtonStyle.Link).setURL(button.url);
  } else {
    builder.setStyle(button.style ?? ButtonStyle.Primary).setCustomId(button.customId);
  }

  return builder;
}
