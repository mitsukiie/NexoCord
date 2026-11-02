import { SeparatorSpacingSize } from 'discord.js';

/**
 * [pt-BR] Tamanhos de título usados por componentes de texto.
 * [en] Heading sizes used by text components.
 */
export enum TextSize {
  /**
   * [pt-BR] Título principal.
   * [en] Main title.
   */
  Title = 1,
  /**
   * [pt-BR] Subtítulo.
   * [en] Subtitle.
   */
  Subtitle = 2,
  /**
   * [pt-BR] Título de seção.
   * [en] Section heading.
   */
  Section = 3,
  /**
   * [pt-BR] Texto pequeno.
   * [en] Small text.
   */
  Small = 4,
}

/**
 * [pt-BR] Espaçamentos disponíveis para separadores.
 * [en] Spacing values available for separators.
 */
export const SeparatorSize = {
  /**
   * [pt-BR] Espaçamento pequeno.
   * [en] Small spacing.
   */
  Small: SeparatorSpacingSize.Small,
  /**
   * [pt-BR] Espaçamento grande.
   * [en] Large spacing.
   */
  Large: SeparatorSpacingSize.Large,
} as const;

/**
 * [pt-BR] Tipo dos valores aceitos por `SeparatorSize`.
 * [en] Type of values accepted by `SeparatorSize`.
 */
export type SeparatorSize = (typeof SeparatorSize)[keyof typeof SeparatorSize];
