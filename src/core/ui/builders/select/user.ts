import type { SelectBase, UserSelect } from '../../types';

/**
 * [pt-BR] Opções adicionais de um menu de seleção.
 * [en] Additional select menu options.
 */
export type SelectBuilderOptions = Omit<SelectBase, 'customId'>;

/**
 * [pt-BR] Entrada de um menu de seleção com todas as opções.
 * [en] Select menu input with all options.
 */
export type SelectBuilderInput = SelectBuilderOptions & {
  customId: SelectBase['customId'];
};

/**
 * Cria um menu de seleção de usuários.
 *
 * [pt-BR] Aceita um `customId` separado ou um objeto completo de configuração.
 * [en] Accepts a separate `customId` or a complete configuration object.
 */
export function user_select(customId: string, options?: SelectBuilderOptions): UserSelect;

export function user_select(options: SelectBuilderInput): UserSelect;

export function user_select(
  customIdOrOptions: string | SelectBuilderInput,
  options: SelectBuilderOptions = {},
): UserSelect {
  if (typeof customIdOrOptions === 'string') {
    return {
      type: 'select.user',
      customId: customIdOrOptions,
      ...options,
    };
  }

  return {
    type: 'select.user',
    ...customIdOrOptions,
  };
}
