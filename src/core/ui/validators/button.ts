import { ButtonStyle } from 'discord.js';

import type { Button } from '../types';
import { UI_LIMITS, UI_REGEX } from '../constants';

export function validate_button(button: Button): void {
  if (!button.label?.trim()) {
    throw new Error('O botão precisa possuir um label.');
  }

  if (button.label.length > UI_LIMITS.button_label) {
    throw new Error(
      `O label do botão não pode ultrapassar ${UI_LIMITS.button_label} caracteres.`,
    );
  }

  if ('url' in button && button.url !== undefined) {
    if (!UI_REGEX.http_url.test(button.url)) {
      throw new Error('A URL do botão precisa ser uma URL HTTP ou HTTPS válida.');
    }

    if (button.style !== undefined && button.style !== ButtonStyle.Link) {
      throw new Error('Botões com URL precisam utilizar o estilo Link.');
    }

    return;
  }

  if (!button.customId?.trim()) {
    throw new Error('O botão precisa possuir um customId.');
  }

  if (button.customId.length > UI_LIMITS.custom_id) {
    throw new Error(
      `O customId do botão não pode ultrapassar ${UI_LIMITS.custom_id} caracteres.`,
    );
  }
}
