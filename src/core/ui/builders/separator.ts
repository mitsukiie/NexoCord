import type { SeparatorComponent, SeparatorOptions } from '../types';

/**
 * Cria um divisor visual.
 *
 * [pt-BR] Controle o espaçamento e a visibilidade da linha com `SeparatorOptions`.
 * [en] Control spacing and line visibility with `SeparatorOptions`.
 *
 * @param options - [pt-BR] Opções do divisor.
 * [en] Separator options.
 */
export function separator(options: SeparatorOptions = {}): SeparatorComponent {
  return {
    type: 'separator',
    ...options,
  };
}

/**
 * Alias para criação de divisores visuais.
 *
 * [pt-BR] Use `separator()` em código novo.
 * [en] Use `separator()` in new code.
 *
 * @deprecated Use `separator()` instead.
 */
export const divider = separator;
