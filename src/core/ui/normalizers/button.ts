import { ButtonBuilder, ButtonStyle } from 'discord.js';

import type { Button } from '../types';
import { validateButton } from '../validators';

/**
 * Creates a Discord button builder from a public button descriptor.
 *
 * @param button Button descriptor.
 * @returns Discord button builder.
 */
export function normalizeButton(button: Button) {
  validateButton(button);

  const built = new ButtonBuilder()
    .setLabel(button.label)
    .setCustomId(button.customId)
    .setStyle(button.style ?? ButtonStyle.Primary);

  if (button.emoji) {
    built.setEmoji({ name: button.emoji });
  }

  return built;
}

/**
 * Applies button data to a button-like Discord builder.
 *
 * @param button Target button builder.
 * @param data Public button descriptor.
 * @returns The same button builder instance for chaining.
 */
export function applyButtonData<
  T extends {
    setLabel(label: string): T;
    setCustomId(id: string): T;
    setStyle(style: ButtonStyle): T;
    setEmoji(emoji: { name: string }): T;
  },
>(button: T, data: Button): T {
  button
    .setLabel(data.label)
    .setCustomId(data.customId)
    .setStyle(data.style ?? ButtonStyle.Primary);

  if (data.emoji) {
    button.setEmoji({ name: data.emoji });
  }

  return button;
}
