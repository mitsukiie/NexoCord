import type { StringSelect, StringSelectOption } from '../../types';

import type { SelectBuilderInput, SelectBuilderOptions } from './user';

/**
 * [pt-BR] Entrada de um menu de strings com suas opções.
 * [en] String menu input with its options.
 */
export type StringSelectBuilderInput = SelectBuilderInput & {
  options: readonly StringSelectOption[];
};

/**
 * [pt-BR] Cria um menu de seleção de strings.
 * [en] Creates a string select menu.
 */
export function string_select(
  customId: string,
  options: readonly StringSelectOption[],
  selectOptions?: SelectBuilderOptions,
): StringSelect;

export function string_select(options: StringSelectBuilderInput): StringSelect;

export function string_select(
  customIdOrOptions: string | StringSelectBuilderInput,
  stringOptions?: readonly StringSelectOption[],
  selectOptions: SelectBuilderOptions = {},
): StringSelect {
  if (typeof customIdOrOptions !== 'string') {
    return {
      type: 'select.string',
      ...customIdOrOptions,
    };
  }

  return {
    type: 'select.string',
    customId: customIdOrOptions,
    ...selectOptions,
    options: stringOptions ?? [],
  };
}
