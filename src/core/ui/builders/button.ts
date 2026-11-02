import type { Button } from '../types';

/**
 * Cria um botão a partir das opções informadas.
 *
 * [pt-BR] Use `customId` para interações ou `url` para botões de link.
 * [en] Use `customId` for interactions or `url` for link buttons.
 *
 * @param options - [pt-BR] Configuração visual e comportamento do botão.
 * [en] Button appearance and behavior.
 * @returns [pt-BR] A configuração do botão.
 * [en] The button configuration.
 */
export function button(options: Button): Button {
  return options;
}
