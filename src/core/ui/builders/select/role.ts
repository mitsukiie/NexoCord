import type { RoleSelect } from '../../types';

import type { SelectBuilderInput, SelectBuilderOptions } from './user';

/**
 * [pt-BR] Cria um menu de seleção de cargos.
 * [en] Creates a role select menu.
 */
export function role_select(customId: string, options?: SelectBuilderOptions): RoleSelect;

export function role_select(options: SelectBuilderInput): RoleSelect;

export function role_select(
  customIdOrOptions: string | SelectBuilderInput,
  options: SelectBuilderOptions = {},
): RoleSelect {
  if (typeof customIdOrOptions === 'string') {
    return {
      type: 'select.role',
      customId: customIdOrOptions,
      ...options,
    };
  }

  return {
    type: 'select.role',
    ...customIdOrOptions,
  };
}
